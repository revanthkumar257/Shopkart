document.addEventListener('DOMContentLoaded', () => {
  const dl = window.adobeDataLayer || [];
  const cartBadge = document.querySelector('[data-role="cart-count"]');

  // Get custData from initial push if available
  const getCustData = () => {
    if (dl.length > 0 && dl[0].custData) {
      return dl[0].custData;
    }
    return {
      custId: '',
      emailID_plain: '',
      loginMethod: 'guest',
      loginStatus: 'anonymous',
      mobileNo_plain: ''
    };
  };

  const updateCartBadge = (count) => {
    if (cartBadge) cartBadge.textContent = count;
  };

  const pushEvent = (payload) => {
    const custData = getCustData();
    dl.push({
      ...payload,
      eventInfo: { eventName: payload.event },
      custData: payload.custData || custData,
      timestamp: new Date().toISOString()
    });
  };

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    const json = await res.json();
    const count = json.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
    updateCartBadge(count);
    return json;
  };

  // initial cart badge refresh
  fetchCart().catch(() => {});

  // Product click handler (for both buttons and images)
  const handleProductClick = (element, e) => {
    e.preventDefault();
    const data = element.dataset;
    const pageType = document.body.dataset.pageType || 'plp';
    const pageName = pageType === 'home' ? 'Home' : 'Product Listing';
    
    pushEvent({
      event: 'productClick',
      page: {
        language: 'en',
        pageName: pageName,
        pageType: pageType,
        url: window.location.href
      },
      product: [
        {
          productId: data.productId,
          productName: data.productName,
          productCategory: data.productCategory,
          brand: data.brand,
          price: Number(data.price),
          position: Number(data.position),
          quantity: 1
        }
      ]
    });
    setTimeout(() => {
      window.location.href = data.href;
    }, 120);
  };

  // PLP/Home product click (buttons and images)
  document.querySelectorAll('[data-action="view-product"]').forEach((btn) => {
    btn.addEventListener('click', (e) => handleProductClick(btn, e));
  });

  // Add to cart on PDP
  const addToCartForm = document.querySelector('#add-to-cart-form');
  if (addToCartForm) {
    addToCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addToCartForm);
      const productId = formData.get('id');
      const qty = Number(formData.get('qty')) || 1;
      const productName = addToCartForm.dataset.productName;
      const price = Number(addToCartForm.dataset.price);

      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, qty })
      });
      const cartState = await res.json();
      const count = cartState.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
      updateCartBadge(count);

      pushEvent({
        event: 'scAdd',
        page: {
          language: 'en',
          pageName: `PDP - ${productName}`,
          pageType: 'pdp',
          url: window.location.href
        },
        product: [
          {
            productId,
            productName,
            productCategory: addToCartForm.dataset.category,
            brand: addToCartForm.dataset.brand,
            price,
            position: Number(addToCartForm.dataset.position),
            quantity: qty
          }
        ],
        cart: cartState
      });

      const notice = document.querySelector('#cart-notice');
      if (notice) {
        notice.textContent = 'Added to cart. Proceed to cart or keep shopping.';
        notice.style.display = 'block';
      }
    });
  }

  // Remove from cart
  document.querySelectorAll('[data-action="remove-item"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.productId;
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId })
      });
      const cartState = await res.json();
      const count = cartState.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
      updateCartBadge(count);
      pushEvent({
        event: 'scRemove',
        page: {
          language: 'en',
          pageName: 'Cart',
          pageType: 'cart',
          url: window.location.href
        },
        cart: cartState
      });
      window.location.reload();
    });
  });

  // Cart link open
  const cartLinks = document.querySelectorAll('[data-role="cart-link"]');
  cartLinks.forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      const state = await fetchCart();
      pushEvent({
        event: 'scOpen',
        page: {
          language: 'en',
          pageName: document.title,
          pageType: document.body.dataset.pageType,
          url: window.location.href
        },
        cart: state
      });
      setTimeout(() => {
        window.location.href = target;
      }, 50);
    });
  });

  // Search form submission (ensure it navigates properly)
  const searchForm = document.querySelector('.search');
  if (searchForm && searchForm.tagName === 'FORM') {
    searchForm.addEventListener('submit', (e) => {
      const input = searchForm.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        e.preventDefault();
        return false;
      }
      // Let form submit naturally to /plp?q=...
    });
  }

  // Hero Carousel
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    let currentSlide = 0;
    let carouselInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    };

    // Auto-advance carousel
    const startCarousel = () => {
      carouselInterval = setInterval(nextSlide, 5000);
    };

    const stopCarousel = () => {
      if (carouselInterval) {
        clearInterval(carouselInterval);
      }
    };

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopCarousel();
        showSlide(index);
        startCarousel();
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // Lazy load images (load next slide when current is active)
    const loadSlideImage = (index) => {
      const slide = slides[index];
      if (slide && !slide.dataset.loaded) {
        const bgImage = slide.style.backgroundImage;
        if (bgImage && bgImage.includes('url')) {
          const img = new Image();
          img.src = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
          img.onload = () => {
            slide.dataset.loaded = 'true';
          };
        }
      }
    };

    // Load first slide immediately, others on demand
    loadSlideImage(0);
    slides.forEach((slide, index) => {
      if (index > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadSlideImage(index);
              observer.unobserve(entry.target);
            }
          });
        }, { rootMargin: '50px' });
        observer.observe(slide);
      }
    });

    // Error handling for background images
    slides.forEach((slide) => {
      const bgImage = slide.style.backgroundImage;
      if (bgImage && bgImage.includes('url')) {
        const img = new Image();
        const imageUrl = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
        img.onerror = () => {
          const fallback = slide.dataset.fallback;
          if (fallback) {
            slide.style.backgroundImage = `url('${fallback}')`;
          }
        };
        img.src = imageUrl;
      }
    });

    // Start carousel
    startCarousel();
  }
});

