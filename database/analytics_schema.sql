-- Analytics table to track page views
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT, -- For unique visitor counting without storing PII
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure session_id exists (for existing tables)
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS session_id UUID;

-- Custom events table (clicks, downloads, etc.)

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_data JSONB,
  path TEXT,
  ip_hash TEXT,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster querying
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts events" ON analytics_events FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read" ON page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read events" ON analytics_events FOR SELECT TO authenticated USING (true);

-- Function to get top referrers
CREATE OR REPLACE FUNCTION get_top_referrers(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (referrer TEXT, count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(NULLIF(pv.referrer, ''), 'Direct')::TEXT as referrer,
    COUNT(*)::BIGINT as count
  FROM page_views pv
  GROUP BY referrer
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$;

-- Function to get device breakdown
CREATE OR REPLACE FUNCTION get_device_breakdown()
RETURNS TABLE (device_type TEXT, count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'Mobile'
      WHEN user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN 'Tablet'
      ELSE 'Desktop'
    END::TEXT as device_type,
    COUNT(*)::BIGINT as count
  FROM page_views
  GROUP BY device_type
  ORDER BY count DESC;
END;
$$;


-- Function to get active users (unique visitors in the last 5 minutes)

CREATE OR REPLACE FUNCTION get_active_users_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT ip_hash) 
    FROM page_views 
    WHERE created_at > NOW() - INTERVAL '5 minutes'
  );
END;
$$;

-- Function to get total unique visitors
CREATE OR REPLACE FUNCTION get_total_unique_visitors()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(DISTINCT ip_hash) FROM page_views);
END;
$$;

-- Function to get top pages
CREATE OR REPLACE FUNCTION get_top_pages(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (path TEXT, views BIGINT, percentage FLOAT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_views BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_views FROM page_views;
  
  RETURN QUERY
  SELECT 
    pv.path,
    COUNT(*) as views,
    (COUNT(*)::FLOAT / NULLIF(total_views, 0) * 100) as percentage
  FROM page_views pv
  GROUP BY pv.path
  ORDER BY views DESC
  LIMIT limit_count;
END;
$$;

-- Function to get views by day for the last 7 days
CREATE OR REPLACE FUNCTION get_views_by_day()
RETURNS TABLE (day DATE, view_count BIGINT, unique_visitors BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d::DATE as day,
    COUNT(pv.id) as view_count,
    COUNT(DISTINCT pv.ip_hash) as unique_visitors
  FROM 
    generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') d
  LEFT JOIN 
    page_views pv ON pv.created_at::DATE = d::DATE
  GROUP BY 
    d::DATE
  ORDER BY 
    d::DATE ASC;
END;
$$;


