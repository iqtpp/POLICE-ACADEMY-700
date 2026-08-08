# Redwood Police Academy V8 — Supabase setup

The application form now writes to `academy_applications` in Supabase. The admin panel uses Supabase Authentication before it can read, update, or delete applications.

## Environment variables

Create a `.env.local` for local development or add the same variables in Netlify:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAIL`

Do **not** put a Supabase service-role key in the frontend.

## Supabase Auth

Create one admin user in Supabase Authentication with the exact email used in `VITE_ADMIN_EMAIL`.

The password entered in the website's admin panel is sent to Supabase Auth; the old hard-coded passwords were removed.

## Database policies

Open `supabase-setup.sql`, replace `admin@example.com` with the admin email, then run the SQL in Supabase SQL Editor.

The policies allow:

- Anyone to INSERT a new academy application.
- Only the configured admin email to SELECT applications.
- Only the configured admin email to UPDATE application status.
- Only the configured admin email to DELETE applications.

There is intentionally no public SELECT policy.

## Expected table columns

The code expects these columns in `academy_applications`:

- `id`
- `full_name`
- `age`
- `discord_id`
- `game_id`
- `department_preference` (nullable)
- `experience` (nullable)
- `why_join`
- `accepted_rules`
- `status`
- `submitted_at`

If your existing table uses different column names, send me a screenshot of the table columns and I can adapt the mapping without changing the website design.
