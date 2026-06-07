# Nike Store — MERN + Vite Frontend

A fully-featured Nike-inspired e-commerce storefront.

## Tech Stack

| Tool | Role |
|---|---|
| **Vite 8** | Build tool & dev server |
| **React 19** | UI framework |
| **React Router DOM 7** | Client-side routing |
| **TanStack React Query 5** | Server state / data fetching |
| **Axios** | HTTP client (wired to /api) |
| **Zustand 5** | Client state (cart, wishlist) |
| **Tailwind CSS v4** | Styling (CSS-first config) |

## Features

- Hero carousel with auto-advancing slides
- Product listing with sidebar filters (category, sport, sort)
- Product detail with color swatches, size picker, ratings
- Slide-in cart drawer with quantity controls (persisted)
- Wishlist with heart-toggle (persisted)
- Checkout page with order confirmation
- Navbar search filtering
- Fully responsive (mobile-first)
- Custom 404 page

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
# http://localhost:5173
```

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com > Add New Project > Import your repo
3. Framework: Vite (auto-detected)
4. Add env variable: VITE_API_URL = https://your-backend.vercel.app/api
5. Deploy

The vercel.json handles SPA routing automatically.

## Connecting a Real Backend

Edit src/hooks/useProducts.js and replace the mock fetch functions with real API calls using the Axios instance in src/lib/api.js.

Your Express backend should expose:
- GET /api/products
- GET /api/products/slug/:slug

## Environment Variables

| Variable | Description |
|---|---|
| VITE_API_URL | Backend API base URL |
