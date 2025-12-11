# Adobe Data Layer (ShopKart Marketplace)

This demo uses a single canonical schema for all pushes. All pushes are performed via `window.adobeDataLayer.push(<object>)`. Server-side pushes are emitted on page render (before analytics snippets). Client-side pushes fire on interactions (clicks, add/remove, checkout).

## Canonical schema

Top-level fields (when applicable):

- `event`: one of `pageView`, `productImpression`, `productDetail`, `productClick`, `scAdd`, `scRemove`, `scOpen`, `scView`, `scCheckout`, `purchase`
- `eventInfo`: `{ eventName: "<same as event>" }`
- `custData`: `{ custId, emailID_plain, loginMethod, loginStatus, mobileNo_plain }`
- `page`: `{ language, pageName, pageType, url }`
  - `pageType` values: `home`, `plp`, `pdp`, `cart`, `checkout`, `thankyou`
- `product`: array of products `{ productId, productName, productCategory, brand, price, position, quantity }`
- `productList`: array (PLP impressions), same shape as `product`
- `cart`: `{ items: [{ productId, productName, price, qty }], total }`
- `order`: `{ id, revenue, products: [{ productId, productName, price, qty }], customerName? }`
- `timestamp`: ISO string (generated server/client)

Notes:
- `product` is always an array, even for a single PDP product.
- Server pushes happen before the analytics embed placeholder.
- Purchase is only pushed after a successful POST `/checkout` redirect; reloading `/thankyou` does not create a new order.

## Event examples

### Home page view (server)
```json
{
  "event": "pageView",
  "eventInfo": { "eventName": "pageView" },
  "page": { "language": "en", "pageName": "Home", "pageType": "home", "url": "http://localhost:3000/" },
  "custData": { "custId": "", "emailID_plain": "", "loginMethod": "guest", "loginStatus": "anonymous", "mobileNo_plain": "" },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### PLP impression (server)
```json
{
  "event": "productImpression",
  "productList": [
    { "productId": "smart-speaker", "productName": "Smart Home Speaker", "productCategory": "Electronics", "brand": "ShopKart", "price": 89, "position": 1, "quantity": 1 }
  ],
  "page": { "language": "en", "pageName": "Product Listing", "pageType": "plp", "url": "http://localhost:3000/plp" }
}
```

### PDP view (server)
```json
{
  "event": "productDetail",
  "product": [
    { "productId": "smart-speaker", "productName": "Smart Home Speaker", "productCategory": "Electronics", "brand": "ShopKart", "price": 89, "position": 1, "quantity": 1 }
  ],
  "page": { "language": "en", "pageName": "PDP - Smart Home Speaker", "pageType": "pdp", "url": "http://localhost:3000/pdp/smart-speaker" }
}
```

### Product click (client on PLP)
```json
{
  "event": "productClick",
  "product": [
    { "productId": "smart-speaker", "productName": "Smart Home Speaker", "productCategory": "Electronics", "brand": "ShopKart", "price": 89, "position": 1, "quantity": 1 }
  ],
  "page": { "language": "en", "pageName": "Product Listing", "pageType": "plp", "url": "http://localhost:3000/plp" }
}
```

### Add to cart (client on PDP)
```json
{
  "event": "scAdd",
  "product": [
    { "productId": "smart-speaker", "productName": "Smart Home Speaker", "productCategory": "Electronics", "brand": "ShopKart", "price": 89, "position": 1, "quantity": 1 }
  ],
  "cart": { "items": [{ "productId": "smart-speaker", "productName": "Smart Home Speaker", "price": 89, "qty": 1 }], "total": 89 }
}
```

### Cart view (server)
```json
{
  "event": "scView",
  "cart": { "items": [...], "total": 100 },
  "page": { "language": "en", "pageName": "Cart", "pageType": "cart", "url": "http://localhost:3000/cart" }
}
```

### Checkout (server)
```json
{
  "event": "scCheckout",
  "cart": { "items": [...], "total": 100 },
  "page": { "language": "en", "pageName": "Checkout", "pageType": "checkout", "url": "http://localhost:3000/checkout" }
}
```

### Purchase (server on /thankyou)
```json
{
  "event": "purchase",
  "order": {
    "id": "ORD-AB12CD",
    "revenue": 100,
    "products": [{ "productId": "smart-speaker", "productName": "Smart Home Speaker", "price": 89, "qty": 1 }]
  },
  "page": { "language": "en", "pageName": "Order Confirmation", "pageType": "thankyou", "url": "http://localhost:3000/thankyou?orderId=ORD-AB12CD" }
}
```

## Placement guidance
- Server push is emitted in `<head>` before the placeholder comment `<!-- Adobe Launch / Analytics embed would be placed after the server push above -->`.
- Add your Launch or analytics snippet directly after that comment to ensure it captures the initial push.
- Client pushes fire via `public/client.js`.

## Dev utilities
- `adl.getLastPush()` returns the last pushed object.
- `adl.get('page.pageName')` safely reads nested fields from the last push.

