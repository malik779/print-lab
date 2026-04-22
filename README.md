# Printlab MVP

Production-ready MVP for custom apparel ordering with Next.js + Supabase + Fabric.js.

## Stack
- Next.js (App Router)
- Node.js runtime with Next API routes
- Supabase Postgres + Storage
- Fabric.js canvas editor
- Tailwind CSS

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. In Supabase SQL editor, run:
   - `supabase/schema.sql`
4. Create storage bucket named `designs` and set it public.
5. Start app:
   ```bash
   npm run dev
   ```

## Endpoints
- `GET /api/products`
- `POST /api/upload-artwork`
- `POST /api/create-order`
- `GET /api/orders`

## MVP flow
1. Browse product listing.
2. Open product detail and select variant.
3. Customize in Fabric.js editor (drag, resize, rotate constrained to printable area).
4. Add to cart (localStorage).
5. Checkout and create order record.
6. Admin page reads order + design JSON + artwork URL.
