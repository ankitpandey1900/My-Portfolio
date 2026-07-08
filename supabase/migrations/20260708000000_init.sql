-- Solar Portfolio — initial schema with RLS
-- Run via Supabase CLI: supabase db push

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  reviewed BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_insert_public" ON contacts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contacts_select_service" ON contacts
  FOR SELECT TO service_role
  USING (true);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  services_selected JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_estimate NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  processed BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes_insert_public" ON quotes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "quotes_select_service" ON quotes
  FOR SELECT TO service_role
  USING (true);

-- Analytics sessions
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT,
  country VARCHAR(3),
  device TEXT,
  browser TEXT
);

ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_insert_public" ON analytics_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "sessions_select_service" ON analytics_sessions
  FOR SELECT TO service_role
  USING (true);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_insert_public" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "events_select_service" ON analytics_events
  FOR SELECT TO service_role
  USING (true);

CREATE INDEX IF NOT EXISTS idx_events_session_type ON analytics_events(session_id, event_type);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON analytics_sessions(country, created_at DESC);

-- Visitor counter (aggregate view)
CREATE OR REPLACE VIEW visitor_count AS
  SELECT COUNT(*)::bigint AS total_sessions FROM analytics_sessions;
