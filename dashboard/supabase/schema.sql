-- NeuralFlow Dashboard Schema
-- Run this in Supabase SQL Editor after creating the project

-- Domains table: stores user's monitored domains
create table if not exists domains (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text,
  created_at timestamptz default now() not null,
  unique(user_id, url)
);

-- Scans table: stores compliance scan results
create table if not exists scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  domain_id uuid references domains(id) on delete cascade not null,
  url text not null,
  score numeric not null,
  grade text not null,
  passed integer not null,
  failed integer not null,
  total integer not null,
  categories jsonb not null,
  checks jsonb not null,
  scanned_at timestamptz default now() not null
);

-- Index for fast lookups
create index if not exists scans_user_id_idx on scans(user_id);
create index if not exists scans_domain_id_idx on scans(domain_id);
create index if not exists domains_user_id_idx on domains(user_id);

-- Row Level Security: users only see their own data
alter table domains enable row level security;
alter table scans enable row level security;

create policy "Users see own domains"
  on domains for select using (auth.uid() = user_id);

create policy "Users insert own domains"
  on domains for insert with check (auth.uid() = user_id);

create policy "Users delete own domains"
  on domains for delete using (auth.uid() = user_id);

create policy "Users see own scans"
  on scans for select using (auth.uid() = user_id);

create policy "Users insert own scans"
  on scans for insert with check (auth.uid() = user_id);

create policy "Users delete own scans"
  on scans for delete using (auth.uid() = user_id);
