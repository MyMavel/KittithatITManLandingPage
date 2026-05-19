# KittithatITMan — Landing Page + Admin ERP (prototype)

A Next.js 15 prototype with two surfaces:

- **Public landing page** at `/` — hero, features, pricing, and contact form.
- **Admin backend** at `/admin` — gated CRM dashboard to manage leads captured from the contact form.

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Prisma · SQLite · `jose` for signed session cookies · `zod` for validation.

---

## Quick start

```bash
# 1. install deps
npm install

# 2. configure environment
cp .env.example .env
# then open .env and fill in ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET

# 3. create the SQLite database
npx prisma migrate dev --name init

# 4. start the dev server
npm run dev
```

Open <http://localhost:3000>.

---

## Routes

### Public
- `/` — landing page
- `POST /api/contact` — submits a lead (writes a `Customer` row)

### Admin (gated)
- `/admin/login` — sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`
- `/admin` — dashboard with lead counts and recent leads
- `/admin/customers` — searchable list of all leads
- `/admin/customers/[id]` — view detail, change status, or delete

### Admin API (require valid session cookie)
- `GET /api/customers?q=...`
- `PATCH /api/customers/:id` — `{ "status": "new" | "contacted" | "qualified" | "won" | "lost" }`
- `DELETE /api/customers/:id`

---

## How auth works

- The login endpoint compares the submitted credentials against `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`.
- On success it signs a JWT (`jose`, HS256, 7-day expiry) using `SESSION_SECRET` and sets an `admin_session` cookie (httpOnly, sameSite=lax).
- `middleware.ts` verifies the cookie on every `/admin/*` and `/api/customers/*` request and redirects unauthenticated traffic to `/admin/login`.

There is **one** hardcoded admin for the prototype. To support multiple admins, replace the credential check with a `User` table and password hashing.

---

## Editing copy

All landing-page copy lives in plain `.tsx` files under `src/components/landing/`:

- `Hero.tsx` — headline, subheadline, CTAs
- `Features.tsx` — `features` array near the top of the file
- `Pricing.tsx` — `tiers` array near the top of the file
- `Footer.tsx` — copyright + links

Brand colour is defined in `src/app/globals.css` under the `@theme` block (`--color-brand-*`).

---

## Useful scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # serve the production build
npm run db:migrate   # create a new migration (alias for prisma migrate dev)
npm run db:studio    # open Prisma Studio to inspect the DB
```

---

## Verify end-to-end

1. `npm run dev`, open <http://localhost:3000>.
2. Scroll to the **Contact** section, submit the form. You should see a success state.
3. Open `npx prisma studio` in another terminal — a row appears in the `Customer` table.
4. Visit `/admin` — you're redirected to `/admin/login`.
5. Sign in with the credentials from `.env`.
6. Dashboard shows lead counts. Open **Customers**, click your lead, change the status to *contacted*, save.
7. Sign out via the header button — `/admin` should redirect to login again.

---

## What's intentionally not built (yet)

- Other ERP modules (Projects, Invoices, Inventory)
- Multi-user admin / password hashing / role-based access
- Email notifications on new lead
- Rate limiting / captcha on the contact form
- Production deploy config (Vercel, Docker)
- Automated tests
