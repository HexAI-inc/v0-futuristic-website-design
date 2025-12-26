-- Migration to add radius and coordinates to biosphere_zones
-- Run this in your Supabase SQL Editor

ALTER TABLE biosphere_zones ADD COLUMN IF NOT EXISTS radius NUMERIC;
ALTER TABLE biosphere_zones ADD COLUMN IF NOT EXISTS coordinates TEXT;

-- Optional: Add comments
COMMENT ON COLUMN biosphere_zones.radius IS 'Radius of the zone in kilometers';
COMMENT ON COLUMN biosphere_zones.coordinates IS 'Center coordinates of the zone as "lng, lat"';
