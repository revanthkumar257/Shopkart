# ShopKart Marketplace (Server-rendered + adobeDataLayer)

Multi-page, server-rendered marketplace (Express + EJS, no SPA). Uses an in-memory store for products, cart, and orders, and wires adobeDataLayer pushes on both server render and client interactions.

## Run locally
1) Install: `npm install`  
2) Start: `npm start`  
3) Open: http://localhost:3000

## Expose via ngrok
```bash
npx ngrok http 3000
```
Share the forwarded URL for remote testing.

## Where to place Launch / analytics
- Each page injects a server-side `window.adobeDataLayer.push(...)` in `<head>`.
- Insert your Launch/analytics snippet **immediately after** the comment `<!-- Adobe Launch / Analytics embed would be placed after the server push above -->` in `views/partials/head.ejs`. This ensures the initial server push is available before analytics loads.

## Data layer utilities
- `adl.getLastPush()` returns the last pushed object.
- `adl.get('page.pageName')` reads a nested value from the last push.
- See `docs/adobe-data-layer.md` for schema and examples.

## Routes (pages)
- `/` Home (server push: `pageView`)
- `/plp?cat=<category>` Product Listing with category filter (server push: `productImpression` with filtered `productList`)
- `/pdp/:id` Product Detail (server push: `productDetail` with `product` array)
- `/cart` Cart (server push: `scView` with `cart`)
- `/checkout` Checkout (server push: `scCheckout` with `cart`)
- `/thankyou?orderId=...` Thank You (server push: `purchase` with `order`; no new order on reload)

## API endpoints
- `GET /api/cart` → current cart JSON
- `POST /api/cart/add` `{ id, qty }` → updates cart
- `POST /api/cart/remove` `{ id }` → removes item
- `POST /checkout` → fake payment, generates order id, clears cart, redirects to `/thankyou`

## Client-side pushes (public/client.js)
- PLP “View” click: `productClick`
- PDP “Add to cart”: `scAdd` (after successful POST)
- Cart link click: `scOpen` (push before navigation)
- Cart page “Remove”: `scRemove`

## QA checklist
- Home: load `/`, run `adl.getLastPush()` → event `pageView`.
- PLP: load `/plp`, inspect server push contains `productImpression` + `productList` >= 3 with images visible.
- PLP click: click “View” → console shows `productClick`; lands on PDP with image.
- PDP: load `/pdp/:id`, `adl.getLastPush()` shows `productDetail` with one product.
- Add to cart: submit “Add to cart” → check `/api/cart` response, console `scAdd`, cart count updates on next render.
- Cart: open `/cart` via nav → push `scOpen` on click and `scView` on page load; verify `cart.items` and `cart.total` with thumbnails.
- Remove: click Remove → `scRemove` then item disappears.
- Checkout: go to `/checkout`, server push `scCheckout`; submit form → redirected to thank you.
- Thank you: confirm order id visible and `purchase` push contains order object; reload does not create a new order.
- Dev helper: run `adl.get('page.pageName')` on any page to confirm helper works.
- Capture screenshots:
  - HTML snippet showing server push in source/Elements.
  - Console with `adl.getLastPush()` for Home, PLP, PDP, `scAdd`, and `purchase`.
  - Network/API responses for `/api/cart` and checkout POST.
  - Thank You page with order id visible.

## Project structure
- `server.js` Express server, routes, and server-side data layer pushes.
- `views/` EJS templates (head/footer partials + pages).
- `public/` client JS, data layer utils, styles, images.
- `docs/adobe-data-layer.md` schema + examples.
- `package.json` start script.

## Image slots / credits
- Category-specific images live under `public/images/<category>/` (electronics, mobiles, fashion, home, beauty). Filenames match the product records (e.g., `public/images/mobiles/Apple iPhone 16 (Black, 128 GB).jpg`).
- If you provide higher-quality replacements, drop them in the same paths with the exact filenames. Current files are zero-byte placeholders pending real uploads.

## Notes
- Orders are in-memory; restarting the server clears state.
- Purchase push is emitted only after successful checkout; `/thankyou` reloads reuse the same stored order.

