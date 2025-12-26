-- Migration to add coordinates to iccas and biosphere tables
-- Run this in your Supabase SQL Editor

-- Add coordinates to iccas
ALTER TABLE iccas ADD COLUMN IF NOT EXISTS coordinates VARCHAR(100);

-- Add coordinates to biosphere
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS coordinates VARCHAR(100);

-- Optional: Add comments
COMMENT ON COLUMN iccas.coordinates IS 'Coordinates of the ICCA as "lng, lat"';
COMMENT ON COLUMN biosphere.coordinates IS 'Primary coordinates of the Biosphere Reserve as "lng, lat"';

-- Update existing Niumi Biosphere with its coordinates
UPDATE biosphere 
SET coordinates = '-16.6, 13.5' 
WHERE name = 'Niumi Biosphere Reserve';
