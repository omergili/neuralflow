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

-- Subscriptions table: tracks Stripe subscriptions
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_stripe_customer_id_idx on subscriptions(stripe_customer_id);

alter table subscriptions enable row level security;

create policy "Users see own subscription"
  on subscriptions for select using (auth.uid() = user_id);

-- Service role handles inserts/updates from webhook (no user policy needed for write)

-- Early Access Signups: email collection for pre-launch validation
create table if not exists early_access_signups (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text default 'landing_page',
  created_at timestamptz default now() not null
);

-- Allow anonymous inserts (no auth required for signup)
alter table early_access_signups enable row level security;

create policy "Anyone can sign up"
  on early_access_signups for insert with check (true);

-- Only service role can read signups (admin/analytics)
create policy "Service role reads signups"
  on early_access_signups for select using (auth.role() = 'service_role');
