const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'shopkart-demo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----- In-memory data -----
const products = [
  {
    id: 'soundbar-mivi-fort',
    name: 'Mivi Fort Sonic 150 Soundbar, 2.1 Channel',
    category: 'Electronics',
    brand: 'Mivi',
    price: 249.0,
    mrp: 329.0,
    badge: 'Deal',
    description: '150W 2.1 channel Bluetooth soundbar with EQ modes and multi-input.',
    bullets: ['150W output', 'BT v5.3', 'Multi-input + EQ modes', 'Wireless subwoofer'],
    specs: [
      ['Power', '150W RMS'],
      ['Channels', '2.1'],
      ['Wireless', 'Bluetooth 5.3']
    ],
    position: 1,
    image: '/images/electronics/Mivi Fort Sonic 150 Soundbar, 2.1 Channel, Multi-Input & EQ Modes, BT v5.3 150 W Bluetooth Soundbar  (Black, Silver, 2.1 Channel.png'
  },
  {
    id: 'tv-tcl-uhd',
    name: 'FALCON by TCL U65 43" 4K Google TV 2025',
    category: 'Electronics',
    brand: 'TCL',
    price: 499.0,
    mrp: 699.0,
    badge: 'Best Seller',
    description: 'Ultra HD 4K Google TV with vivid picture, Dolby support, and streaming apps.',
    bullets: ['4K UHD', 'Google TV', 'Dolby Vision/Atmos', 'Built-in Chromecast'],
    specs: [
      ['Resolution', '3840x2160'],
      ['OS', 'Google TV'],
      ['Size', '43 inch']
    ],
    position: 2,
    image: '/images/electronics/FALCON by TCL U65 108 cm (43 inch) Ultra HD (4K) LED Smart Google TV 2025.png'
  },
  {
    id: 'trimmer-philips',
    name: 'PHILIPS BT3101/15 Beard Trimmer',
    category: 'Electronics',
    brand: 'Philips',
    price: 29.0,
    mrp: 39.0,
    badge: 'Trending',
    description: 'Lift & Trim tech for even trims, 45 min runtime, 10 length settings.',
    bullets: ['45 min cordless', '10 length settings', 'Lift & Trim tech', 'USB charging'],
    specs: [
      ['Runtime', '45 min'],
      ['Settings', '10'],
      ['Charging', 'USB']
    ],
    position: 3,
    image: '/images/electronics/PHILIPS BT310115, Lift & Trim Tech, Effortless Even Trim Trimmer 45 min Runtime 10 Length Settings  (White).png'
  },
  {
    id: 'headphones-jbl',
    name: 'JBL Tune 770NC Wireless ANC Headphones',
    category: 'Electronics',
    brand: 'JBL',
    price: 119.0,
    mrp: 149.0,
    badge: 'Deal',
    description: 'Over-ear ANC headphones with 70 hrs battery and speed charge.',
    bullets: ['ANC with transparency', '70 hrs battery', 'Speed charge 5 min = 3 hrs', 'Multipoint BT'],
    specs: [
      ['Battery', 'Up to 70 hrs'],
      ['Charging', 'Speed charge'],
      ['ANC', 'Active']
    ],
    position: 4,
    image: '/images/electronics/JBL Tune 770NC Wireless Over Ear ANC Headphones with Mic, Upto 70 Hrs Battery, Speed Charge  5 min Charge Gives up to 3H of Playback.png'
  },
  {
    id: 'pixel-10-pro',
    name: 'Google Pixel 10 Pro (Moonstone, 256 GB)',
    category: 'Mobiles',
    brand: 'Google',
    price: 999.0,
    mrp: 1099.0,
    badge: 'Best Seller',
    description: 'Flagship Pixel with Gemini features, pro camera, and smooth display.',
    bullets: ['Gemini on-device', 'Pro camera', 'All-day battery', '120Hz display'],
    specs: [
      ['Storage', '256 GB'],
      ['RAM', '16 GB'],
      ['Display', '120Hz AMOLED']
    ],
    position: 5,
    image: '/images/mobiles/Google Pixel 10 Pro (Moonstone, 256 GB)  (16 GB RAM).png'
  },
  {
    id: 'iphone-16',
    name: 'Apple iPhone 16 (Black, 128 GB)',
    category: 'Mobiles',
    brand: 'Apple',
    price: 899.0,
    mrp: 999.0,
    badge: 'Trending',
    description: 'Latest iPhone with advanced cameras and smooth performance.',
    bullets: ['Advanced dual camera', 'A-series performance', 'iOS ecosystem', 'OLED display'],
    specs: [
      ['Storage', '128 GB'],
      ['Display', 'OLED'],
      ['Security', 'Face ID']
    ],
    position: 6,
    image: '/images/mobiles/Apple iPhone 16 (Black, 128 GB).png'
  },
  {
    id: 'galaxy-s28',
    name: 'Samsung Galaxy S28',
    category: 'Mobiles',
    brand: 'Samsung',
    price: 949.0,
    mrp: 1049.0,
    badge: 'Deal',
    description: 'Premium Galaxy with pro-grade camera and S-series performance.',
    bullets: ['Dynamic AMOLED', 'Pro camera system', 'Fast charging', 'One UI'],
    specs: [
      ['Display', 'AMOLED'],
      ['Camera', 'Pro-grade'],
      ['Charging', 'Fast']
    ],
    position: 7,
    image: '/images/mobiles/Samsung Galaxy S28.png'
  },
  {
    id: 'oppo-find-x9',
    name: 'OPPO Find X9',
    category: 'Mobiles',
    brand: 'OPPO',
    price: 799.0,
    mrp: 899.0,
    badge: 'Trending',
    description: 'Sleek design with powerful camera array and fast charging.',
    bullets: ['Triple camera', 'Fast charge', 'AMOLED display', 'Premium finish'],
    specs: [
      ['Camera', 'Triple'],
      ['Display', 'AMOLED'],
      ['Charging', 'Fast']
    ],
    position: 8,
    image: '/images/mobiles/OPPO Find X9.png'
  },
  {
    id: 'sneakers-yoho',
    name: 'YOHO Colored Suede Fashion Sneakers',
    category: 'Fashion',
    brand: 'YOHO',
    price: 69.0,
    mrp: 89.0,
    badge: 'Deal',
    description: 'Comfortable suede sneakers with colorful accents.',
    bullets: ['Suede upper', 'Cushioned sole', 'Casual wear', 'Lightweight'],
    specs: [
      ['Material', 'Suede'],
      ['Type', 'Sneakers'],
      ['Use', 'Casual']
    ],
    position: 9,
    image: '/images/fashion/YOHO Colored Suede Fashion Sneakers.png'
  },
  {
    id: 'denim-jacket',
    name: 'Men Solid Denim Jacket',
    category: 'Fashion',
    brand: 'DenimCo',
    price: 79.0,
    mrp: 109.0,
    badge: 'Best Seller',
    description: 'Classic denim jacket with solid wash and structured fit.',
    bullets: ['Solid wash', 'Button closure', 'Chest pockets', 'Everyday wear'],
    specs: [
      ['Material', 'Denim'],
      ['Fit', 'Regular'],
      ['Closure', 'Buttons']
    ],
    position: 10,
    image: '/images/fashion/Men Solid Denim Jacket.png'
  },
  {
    id: 'striped-tee',
    name: 'Men Striped Zip Neck Tshirt',
    category: 'Fashion',
    brand: 'ActiveWear',
    price: 39.0,
    mrp: 59.0,
    badge: 'Trending',
    description: 'Striped zip-neck tee with sporty collar.',
    bullets: ['Zip neck', 'Striped design', 'Soft fabric', 'Casual sporty'],
    specs: [
      ['Material', 'Cotton blend'],
      ['Neck', 'Zip'],
      ['Fit', 'Regular']
    ],
    position: 11,
    image: '/images/fashion/Men Striped ZiP Neck Tshirt.png'
  },
  {
    id: 'jeans-loose-fit',
    name: 'Men Loose Fit Mid Rise Light Blue Jeans',
    category: 'Fashion',
    brand: 'UrbanFit',
    price: 59.0,
    mrp: 79.0,
    badge: 'Deal',
    description: 'Relaxed mid-rise jeans in light blue wash.',
    bullets: ['Loose fit', 'Mid rise', 'Light blue wash', 'Comfort stretch'],
    specs: [
      ['Fit', 'Loose'],
      ['Rise', 'Mid'],
      ['Wash', 'Light blue']
    ],
    position: 12,
    image: '/images/fashion/Men Loose Fit Mid Rise Light Blue Jeans.png'
  },
  {
    id: 'key-holder',
    name: 'Premium Home Decor Wood Key Holder (7 Hooks)',
    category: 'Home',
    brand: 'Home Decor',
    price: 24.0,
    mrp: 34.0,
    badge: 'Trending',
    description: 'Wall-mounted wooden key holder with 7 hooks and engraved design.',
    bullets: ['7 hooks', 'Wood build', 'Wall mount', 'Decorative engraving'],
    specs: [
      ['Hooks', '7'],
      ['Material', 'Wood'],
      ['Mount', 'Wall']
    ],
    position: 13,
    image: '/images/home/Premium HomePremium Home is Our Happy Place for Home and Office Decor Wood Key Holder  (7 Hooks, Brown).png'
  },
  {
    id: 'home-temple',
    name: 'Homewey Decor Engineered Wood Home Temple',
    category: 'Home',
    brand: 'Homewey',
    price: 119.0,
    mrp: 149.0,
    badge: 'Best Seller',
    description: 'Engineered wood temple with bells and storage shelf, DIY assembly.',
    bullets: ['Engineered wood', 'DIY assembly', 'Includes bells', 'Compact size'],
    specs: [
      ['Material', 'Engineered wood'],
      ['Assembly', 'DIY'],
      ['Height', '47']
    ],
    position: 14,
    image: '/images/home/homewey decor Engineered Wood Home Temple  (Height 47, DIY(Do-It-Yourself)).png'
  },
  {
    id: 'cookware-impex',
    name: 'IMPEX 6 Pcs Nonstick Granite Cookware Set',
    category: 'Home',
    brand: 'Impex',
    price: 89.0,
    mrp: 129.0,
    badge: 'Deal',
    description: '6-piece nonstick granite cookware set with induction base.',
    bullets: ['6-piece set', 'Granite nonstick', 'Induction bottom', 'Gift ready'],
    specs: [
      ['Pieces', '6'],
      ['Material', 'Granite nonstick'],
      ['Base', 'Induction']
    ],
    position: 15,
    image: '/images/home/IMPEX 6 Pcs Nonstick Granite FKTM 6 Festival Gift Set Induction Bottom Non-Stick Coated Cookware Set  (Aluminium, 6 - Piece).png'
  },
  {
    id: 'makeup-brush-set',
    name: 'MINARA Makeup Brush Applicator Set of 15',
    category: 'Beauty',
    brand: 'MINARA',
    price: 39.0,
    mrp: 59.0,
    badge: 'Deal',
    description: '15-piece makeup brush set with premium leather pouch.',
    bullets: ['15 brushes', 'Leather pouch', 'Soft bristles', 'Face & eye set'],
    specs: [
      ['Pieces', '15'],
      ['Case', 'Leather pouch'],
      ['Use', 'Face and eye']
    ],
    position: 16,
    image: '/images/beauty/MINARA Makeup Brush Applicator Set of 15 with Premium Leather Pouch  (Pack of 15).png'
  },
  {
    id: 'eye-cream',
    name: 'Minimalist Vitamin K + Retinal 01% Eye Cream',
    category: 'Beauty',
    brand: 'Minimalist',
    price: 15.0,
    mrp: 22.0,
    badge: 'Trending',
    description: 'Eye cream for dark circles and puffiness with Vitamin K & Retinal.',
    bullets: ['Vitamin K + Retinal', 'Reduces dark circles', 'For puffiness', 'Derm-tested'],
    specs: [
      ['Use', 'Eye area'],
      ['Key', 'Vitamin K + Retinal'],
      ['Size', '14g']
    ],
    position: 17,
    image: '/images/beauty/Minimalist Vitamin K + Retinal 01% Eye Cream for under-eye dark circles & Puffiness  (14 g).png'
  },
  {
    id: 'ponds-facewash',
    name: "POND's Bright Beauty Face Wash 200g",
    category: 'Beauty',
    brand: "POND's",
    price: 9.0,
    mrp: 14.0,
    badge: 'Best Seller',
    description: 'Niacinamide facewash for brightness and anti-dullness.',
    bullets: ['Niacinamide (B3)', 'Anti-dullness', 'Glass skin shine', '200g tube'],
    specs: [
      ['Ingredient', 'Niacinamide B3'],
      ['Benefit', 'Anti-dullness'],
      ['Size', '200g']
    ],
    position: 18,
    image: "/images/beauty/POND's Bright Beauty Infused with vitamin B3 & Niacinamide for Anti Dullness & glass skin shine Face Wash  (200 g).png"
  }
];

let cart = { items: [] };
const orders = {};
const users = {}; // In-memory user store: { email: { id, name, email, password } }
let userIdCounter = 1;

// ----- Helpers -----
const formatUrl = (req) => `${req.protocol}://${req.get('host')}${req.originalUrl}`;

const getCustData = (req) => {
  if (req.session && req.session.user) {
    return {
      custId: req.session.user.id.toString(),
      emailID_plain: req.session.user.email,
      loginMethod: 'local',
      loginStatus: 'authenticated',
      mobileNo_plain: ''
    };
  }
  return {
    custId: '',
    emailID_plain: '',
    loginMethod: 'guest',
    loginStatus: 'anonymous',
    mobileNo_plain: ''
  };
};

const cartTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0);

const findProduct = (id) => products.find((p) => p.id === id);

const mapCartItems = (items) =>
  items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    qty: item.qty,
    image: item.image,
    brand: item.brand
  }));

const buildBasePush = ({ event, pageType, pageName, url, extra = {}, req }) => ({
  event,
  eventInfo: { eventName: event },
  custData: req ? getCustData(req) : {
    custId: '',
    emailID_plain: '',
    loginMethod: 'guest',
    loginStatus: 'anonymous',
    mobileNo_plain: ''
  },
  page: {
    language: 'en',
    pageName,
    pageType,
    url
  },
  timestamp: new Date().toISOString(),
  ...extra
});

const cartState = () => ({
  items: mapCartItems(cart.items),
  total: Number(cartTotal(cart.items).toFixed(2))
});

const ensureCartCount = () =>
  cart.items.reduce((sum, item) => sum + item.qty, 0);

// ----- Routes -----
app.get('/', (req, res) => {
  const initialPush = buildBasePush({
    event: 'pageView',
    pageType: 'home',
    pageName: 'Home',
    url: formatUrl(req),
    req
  });

  res.render('home', {
    title: 'Home',
    initialPush,
    products,
    cartCount: ensureCartCount(),
    user: req.session?.user || null
  });
});

app.get('/plp', (req, res) => {
  const category = (req.query.cat || '').toLowerCase();
  const searchQuery = (req.query.q || '').toLowerCase().trim();
  
  let filtered = products;
  
  // Filter by category if provided
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category);
  }
  
  // Filter by search query if provided
  if (searchQuery) {
    filtered = filtered.filter((p) => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }
  
  const productList = filtered.map((p, idx) => ({
    productId: p.id,
    productName: p.name,
    productCategory: p.category,
    brand: p.brand,
    price: p.price,
    position: idx + 1,
    quantity: 1
  }));
  const catLabel = category && category !== 'all'
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All';
  const initialPush = buildBasePush({
    event: 'productImpression',
    pageType: 'plp',
    pageName: `Product Listing - ${catLabel}`,
    url: formatUrl(req),
    extra: { productList },
    req
  });

  res.render('plp', {
    title: 'Product Listing',
    products: filtered,
    selectedCategory: category || 'all',
    searchQuery: req.query.q || '',
    initialPush,
    cartCount: ensureCartCount(),
    user: req.session?.user || null
  });
});

app.get('/pdp/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).send('Product not found');
  }

  const initialPush = buildBasePush({
    event: 'productDetail',
    pageType: 'pdp',
    pageName: `PDP - ${product.name}`,
    url: formatUrl(req),
    extra: {
      product: [
        {
          productId: product.id,
          productName: product.name,
          productCategory: product.category,
          brand: product.brand,
          price: product.price,
          position: product.position,
          quantity: 1
        }
      ]
    },
    req
  });

  res.render('pdp', {
    title: product.name,
    product,
    initialPush,
    cartCount: ensureCartCount(),
    user: req.session?.user || null
  });
});

app.get('/cart', (req, res) => {
  const items = cart.items;

  const initialPush = buildBasePush({
    event: 'scView',
    pageType: 'cart',
    pageName: 'Cart',
    url: formatUrl(req),
    extra: {
      cart: cartState()
    },
    req
  });

  res.render('cart', {
    title: 'Cart',
    items,
    total: cartTotal(items),
    initialPush,
    cartCount: ensureCartCount(),
    user: req.session?.user || null
  });
});

app.get('/checkout', (req, res) => {
  if (!cart.items.length) {
    return res.redirect('/cart');
  }

  const initialPush = buildBasePush({
    event: 'scCheckout',
    pageType: 'checkout',
    pageName: 'Checkout',
    url: formatUrl(req),
    extra: {
      cart: cartState()
    },
    req
  });

  // Always pass formData - prefill from user session if logged in
  const formData = req.session?.user ? {
    name: req.session.user.name || '',
    email: req.session.user.email || ''
  } : {};

  res.render('checkout', {
    title: 'Checkout',
    items: cart.items,
    total: cartTotal(cart.items),
    initialPush,
    cartCount: ensureCartCount(),
    user: req.session?.user || null,
    error: null,
    formData: formData
  });
});

app.post('/checkout', (req, res) => {
  if (!cart.items.length) {
    return res.redirect('/cart');
  }

  const {
    name,
    email,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    phone,
    paymentMethod
  } = req.body;

  // Basic validation
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !email.trim()) errors.push('Email is required');
  if (!addressLine1 || !addressLine1.trim()) errors.push('Address line 1 is required');
  if (!city || !city.trim()) errors.push('City is required');
  if (!state || !state.trim()) errors.push('State is required');
  if (!postalCode || !postalCode.trim()) errors.push('Postal code is required');
  if (!phone || !phone.trim()) errors.push('Phone number is required');
  if (!paymentMethod) errors.push('Payment method is required');

  if (errors.length > 0) {
    // Log validation errors for debugging
    console.log('Checkout validation errors:', errors);
    console.log('Submitted form data:', req.body);

    const initialPush = buildBasePush({
      event: 'scCheckout',
      pageType: 'checkout',
      pageName: 'Checkout',
      url: formatUrl(req),
      extra: { cart: cartState() },
      req
    });
    return res.render('checkout', {
      title: 'Checkout',
      items: cart.items,
      total: cartTotal(cart.items),
      initialPush,
      cartCount: ensureCartCount(),
      user: req.session?.user || null,
      error: errors.join(', '),
      formData: req.body || {}
    });
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
  const revenue = Number(cartTotal(cart.items).toFixed(2));
  const order = {
    id: orderId,
    revenue,
    products: mapCartItems(cart.items),
    customerName: name.trim(),
    email: email.trim(),
    shippingAddress: {
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim() || '',
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      phone: phone.trim()
    },
    paymentMethod: paymentMethod,
    customerId: req.session?.user?.id || null,
    createdAt: new Date().toISOString()
  };

  orders[orderId] = order;
  cart = { items: [] };

  res.redirect(`/thankyou?orderId=${orderId}`);
});

app.get('/thankyou', (req, res) => {
  const orderId = req.query.orderId;
  const order = orderId ? orders[orderId] : null;

  if (!order) {
    return res.status(400).send('No order found. Please complete checkout.');
  }

  // Prevent duplicate purchase events on reload
  if (!order.purchaseEventPushed) {
    const initialPush = buildBasePush({
      event: 'purchase',
      pageType: 'thankyou',
      pageName: 'Order Confirmation',
      url: formatUrl(req),
      extra: { order },
      req
    });
    order.purchaseEventPushed = true;

    res.render('thankyou', {
      title: 'Thank You',
      order,
      initialPush,
      cartCount: ensureCartCount(),
      user: req.session?.user || null
    });
  } else {
    // Reload case - render without pushing purchase event again
    const initialPush = buildBasePush({
      event: 'pageView',
      pageType: 'thankyou',
      pageName: 'Order Confirmation',
      url: formatUrl(req),
      req
    });
    res.render('thankyou', {
      title: 'Thank You',
      order,
      initialPush,
      cartCount: ensureCartCount(),
      user: req.session?.user || null
    });
  }
});

// ----- Account Routes -----
app.get('/account', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/');
  }
  const initialPush = buildBasePush({
    event: 'pageView',
    pageType: 'account',
    pageName: 'Account',
    url: formatUrl(req),
    req
  });
  res.render('account', {
    title: 'Account',
    initialPush,
    cartCount: ensureCartCount(),
    user: null,
    error: null
  });
});

app.get('/signup', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/');
  }
  const initialPush = buildBasePush({
    event: 'pageView',
    pageType: 'signup',
    pageName: 'Sign Up',
    url: formatUrl(req),
    req
  });
  res.render('signup', {
    title: 'Sign Up',
    initialPush,
    cartCount: ensureCartCount(),
    user: null,
    error: null
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    const initialPush = buildBasePush({
      event: 'pageView',
      pageType: 'signup',
      pageName: 'Sign Up',
      url: formatUrl(req),
      req
    });
    return res.render('signup', {
      title: 'Sign Up',
      initialPush,
      cartCount: ensureCartCount(),
      user: null,
      error: 'All fields are required'
    });
  }

  if (users[email.toLowerCase()]) {
    const initialPush = buildBasePush({
      event: 'pageView',
      pageType: 'signup',
      pageName: 'Sign Up',
      url: formatUrl(req),
      req
    });
    return res.render('signup', {
      title: 'Sign Up',
      initialPush,
      cartCount: ensureCartCount(),
      user: null,
      error: 'Email already registered'
    });
  }

  const user = {
    id: userIdCounter++,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password // In production, hash this
  };
  users[user.email] = user;
  req.session.user = { id: user.id, name: user.name, email: user.email };
  
  res.redirect('/');
});

app.get('/login', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/');
  }
  const initialPush = buildBasePush({
    event: 'pageView',
    pageType: 'login',
    pageName: 'Log In',
    url: formatUrl(req),
    req
  });
  res.render('login', {
    title: 'Log In',
    initialPush,
    cartCount: ensureCartCount(),
    user: null,
    error: null
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    const initialPush = buildBasePush({
      event: 'pageView',
      pageType: 'login',
      pageName: 'Log In',
      url: formatUrl(req),
      req
    });
    return res.render('login', {
      title: 'Log In',
      initialPush,
      cartCount: ensureCartCount(),
      user: null,
      error: 'Email and password are required'
    });
  }

  const user = users[email.toLowerCase()];
  if (!user || user.password !== password) {
    const initialPush = buildBasePush({
      event: 'pageView',
      pageType: 'login',
      pageName: 'Log In',
      url: formatUrl(req),
      req
    });
    return res.render('login', {
      title: 'Log In',
      initialPush,
      cartCount: ensureCartCount(),
      user: null,
      error: 'Invalid email or password'
    });
  }

  req.session.user = { id: user.id, name: user.name, email: user.email };
  res.redirect(req.query.redirect || '/');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/');
  });
});

// ----- API -----
app.get('/api/cart', (req, res) => {
  res.json(cartState());
});

app.post('/api/cart/add', (req, res) => {
  const { id, qty = 1 } = req.body;
  const product = findProduct(id);
  if (!product) {
    return res.status(400).json({ error: 'Invalid product' });
  }
  const quantity = Number(qty) || 1;
  const existing = cart.items.find((item) => item.productId === id);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      qty: quantity,
      image: product.image,
      brand: product.brand
    });
  }
  res.json(cartState());
});

app.post('/api/cart/remove', (req, res) => {
  const { id } = req.body;
  cart.items = cart.items.filter((item) => item.productId !== id);
  res.json(cartState());
});

app.listen(PORT, () => {
  console.log(`ShopKart marketplace running on http://localhost:${PORT}`);
});

