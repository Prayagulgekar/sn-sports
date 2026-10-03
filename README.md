# SN SPORTS

SN SPORTS is a jersey storefront and admin site built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase.

## Requirements

- Node.js 18.17 or newer
- A Supabase project

## Local setup

1. Install dependencies with `npm install`.
2. In the Supabase SQL editor, run `supabase/schema.sql` once to create the tables, policies, media bucket, and starter categories.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`. The service role key is not used by this app; never expose one in client code.
4. Start the development server with `npm run dev` and open `http://localhost:3000`.
5. Create a user in Supabase Authentication. To grant that user admin access, run `update profiles set role = 'admin' where email = 'you@example.com';` in the SQL editor, replacing the example address with the user's email.
6. Open `http://localhost:3000/admin/login`. Configure the Supabase Auth Site URL for the local or deployed site and allow the corresponding `/admin` redirect URL for password resets.

Without valid Supabase URL and anon key values, pages that use Supabase cannot run.

## Production build

Run `npx tsc --noEmit` and `npm run build`. The app uses system font stacks so a production build does not need to download Google Fonts.

## Deploy to Vercel

1. Push this project to a Git repository and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in the Vercel project environment settings for each deployment environment.
3. Deploy, then set the Supabase Auth Site URL to the deployed domain and add `https://your-domain.example/admin` to the allowed redirect URLs.
4. Apply `supabase/schema.sql` to the Supabase project if it has not already been applied, then grant admin access to the intended user as described above.

`SUPABASE_SERVICE_ROLE_KEY` is listed in `.env.example` for server-only integrations but is not required or read by the current application. Do not add it to browser code or expose it through a `NEXT_PUBLIC_` variable.

## Current behavior

- Admin screens manage products, categories, offers, gallery images, business settings, and bulk, tournament, league, and custom requests.
- Product and gallery uploads are limited to JPEG, PNG, or WebP and 5 MB per image.
- Product browsing supports `/shop` and category pages at `/shop/[category]`.
- Customer orders are composed into a WhatsApp message; this project does not store checkout orders in its database.
- Customer request forms submit to `/api/requests` and are visible in the admin request screens.
- Product/cart state is browser-side. Per-size inventory, image compression, and order history are not implemented.

## Environment files

`.env.local` is ignored by Git. Keep real credentials there and commit only `.env.example` with placeholders.
