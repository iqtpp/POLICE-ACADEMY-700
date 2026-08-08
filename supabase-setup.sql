-- Redwood Police Academy V8
-- Run this in Supabase SQL Editor after creating the academy_applications table.
--
-- IMPORTANT:
-- Replace admin@example.com below with the exact email used for the academy admin
-- account in Supabase Authentication.

-- Make sure the application fields used by the website exist.
-- Existing columns are left untouched.
alter table public.academy_applications
  add column if not exists full_name text,
  add column if not exists age integer,
  add column if not exists discord_id text,
  add column if not exists game_id text,
  add column if not exists department_preference text,
  add column if not exists experience text,
  add column if not exists why_join text,
  add column if not exists accepted_rules boolean default false,
  add column if not exists status text default 'قيد المراجعة',
  add column if not exists submitted_at timestamptz default now();

alter table public.academy_applications enable row level security;

drop policy if exists "academy applications public insert" on public.academy_applications;
drop policy if exists "academy applications admin select" on public.academy_applications;
drop policy if exists "academy applications admin update" on public.academy_applications;
drop policy if exists "academy applications admin delete" on public.academy_applications;

create policy "academy applications public insert"
on public.academy_applications
for insert
to anon, authenticated
with check (true);

create policy "academy applications admin select"
on public.academy_applications
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'admin@example.com');

create policy "academy applications admin update"
on public.academy_applications
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'admin@example.com')
with check ((auth.jwt() ->> 'email') = 'admin@example.com');

create policy "academy applications admin delete"
on public.academy_applications
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'admin@example.com');

-- Recommended column defaults if your table does not already have them:
-- id uuid primary key default gen_random_uuid()
-- status text not null default 'قيد المراجعة'
-- submitted_at timestamptz not null default now()
