-- Migration: Early Access Email-Signups
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/uowuwidlloewwapiaxgj/sql
-- Date: 2026-03-28

CREATE TABLE IF NOT EXISTS early_access_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'landing_page',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE early_access_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up (no auth required)
CREATE POLICY "Anyone can sign up"
  ON early_access_signups FOR INSERT WITH CHECK (true);

-- Only service role can read (admin/analytics)
CREATE POLICY "Service role reads signups"
  ON early_access_signups FOR SELECT USING (auth.role() = 'service_role');
