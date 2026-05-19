# KittithatITMan — Landing Page + Admin ERP (prototype)

A Next.js 16 prototype with two surfaces:

- **Public landing page** at `/` — hero, features, pricing, and contact form.
- **Admin backend** at `/admin` — gated CRM dashboard powered by Supabase Auth + Postgres.

Stack: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth + RLS) · `@supabase/ssr` · `zod`.

---

## Quick start

```bash
# 1. install deps
npm install

# 2. configure environment
cp .env.example .env
# then open .env and fill in NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
# (find both at https://supabase.com/dashboard -> your project -> Project Settings -> API)

# 3. start the dev server
npm run dev
```

Open <http://localhost:3000>.

> The Supabase schema is already applied to the project. To re-apply / extend it,
> see the migration in [docs/db/schema.sql](docs/db/schema.sql) or apply via the Supabase dashboard / CLI.

---

## Routes

### Public
- `/` — landing page
- `POST /api/contact` — submits a lead (insert into `public.customers` via anon RLS policy)

### Admin (gated)
- `/admin/signup` — create a new admin account (email + password + name)
- `/admin/login` — sign in
- `/admin/auth/callback` — handles email-confirmation links from Supabase
- `/admin` — dashboard with lead counts and recent leads
- `/admin/customers` — searchable list of all leads
- `/admin/customers/[id]` — view detail, change status, or delete

---

## Database schema

Two tables in `public`, both with RLS enabled.

### `public.profiles`
Mirrors `auth.users` 1:1 — a row is auto-created on signup via a trigger.

| Column      | Type        | Default              |
|-------------|-------------|----------------------|
| id          | uuid (PK)   | references `auth.users(id)` ON DELETE CASCADE |
| email       | text        | from `auth.users.email` |
| full_name   | text        | from signup form (`user_metadata.full_name`) |
| role        | text        | `'admin'` (one of `owner`, `admin`, `staff`) |
| approved    | boolean     | `true`               |
| created_at  | timestamptz | `now()`              |
| updated_at  | timestamptz | `now()`              |

**RLS:** users can SELECT and UPDATE only their own profile row.

### `public.customers`
Leads captured from the landing-page contact form.

| Column      | Type        | Default              |
|-------------|-------------|----------------------|
| id          | uuid (PK)   | `gen_random_uuid()`  |
| name        | text        | (required)           |
| email       | text        | (required)           |
| company     | text        | nullable             |
| message     | text        | nullable             |
| source      | text        | `'landing_contact_form'` |
| status      | text        | `'new'` (one of `new`, `contacted`, `qualified`, `won`, `lost`) |
| created_at  | timestamptz | `now()`              |
| updated_at  | timestamptz | `now()` (auto-bump trigger) |

**RLS:**
- `INSERT` allowed for `anon` + `authenticated` (so the public contact form works).
- `SELECT` requires an authenticated session.
- `UPDATE` and `DELETE` additionally require an **approved** profile.

---

## How auth works

- **Signup** (`/admin/signup`) calls `supabase.auth.signUp({ email, password, options: { data: { full_name }, emailRedirectTo: '/admin/auth/callback' } })`. Supabase emails a confirmation link.
- A Postgres trigger (`on_auth_user_created` → `public.handle_new_user`) inserts a matching `profiles` row.
- **Email click** → `/admin/auth/callback?code=...` exchanges the code for a session and redirects to `/admin`.
- **Login** (`/admin/login`) calls `supabase.auth.signInWithPassword`.
- The Supabase session cookie is kept in sync by `middleware.ts` (via `@supabase/ssr`).
- `/admin/*` (except `/admin/login`, `/admin/signup`, `/admin/auth/*`) is gated by middleware: no session ⇒ redirect to `/admin/login?next=…`.

> **Email confirmation:** new Supabase projects require email confirmation by default. To skip it for testing, open the Supabase dashboard → Authentication → Providers → Email → disable “Confirm email”.

---

## Useful scripts

```bash
npm run dev          # start dev server (Turbopack)
npm run build        # production build
npm run start        # serve the production build
```

---

## Verify end-to-end

1. `npm run dev`, open <http://localhost:3000>.
2. Scroll to **Contact** and submit the form. You should see a success state.
3. Open Supabase dashboard → Table editor → `customers` and confirm the row.
4. Visit `/admin` → redirected to `/admin/login`.
5. Click **Sign up**, create an account, confirm the email (or pre-disable confirmation in the dashboard).
6. After confirming, sign in → dashboard appears with lead counts.
7. Open **Customers**, click your lead, change status to *contacted*, save.
8. Sign out via the header button → `/admin` redirects to login again.

---

## What's intentionally not built (yet)

- Other ERP modules (Projects, Invoices, Inventory)
- Role-based access control beyond `approved` boolean (the `role` column exists but is not enforced yet)
- Password reset / magic-link UI (Supabase APIs are ready, just no frontend)
- Email notifications on new lead
- Rate limiting / captcha on the contact form
- Production deploy config
- Automated tests
