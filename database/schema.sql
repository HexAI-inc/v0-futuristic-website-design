-- NBSAP Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parks Table
CREATE TABLE IF NOT EXISTS parks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  size VARCHAR(100),
  established VARCHAR(50),
  location VARCHAR(255),
  coordinates VARCHAR(100),
  wildlife TEXT[],
  activities TEXT[],
  best_time VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Park Features Table
CREATE TABLE IF NOT EXISTS park_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID REFERENCES parks(id) ON DELETE CASCADE,
  icon VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Park Gallery Table
CREATE TABLE IF NOT EXISTS park_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID REFERENCES parks(id) ON DELETE CASCADE,
  url VARCHAR(500),
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ICCAs Table
CREATE TABLE IF NOT EXISTS iccas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  summary TEXT,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ICCA Gallery Table
CREATE TABLE IF NOT EXISTS icca_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icca_id UUID REFERENCES iccas(id) ON DELETE CASCADE,
  src VARCHAR(500),
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biosphere Table
CREATE TABLE IF NOT EXISTS biosphere (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  designation_year INTEGER,
  total_area_hectares INTEGER,
  communities_involved INTEGER,
  unesco_program VARCHAR(255),
  hero_image_url VARCHAR(500),
  zones_title TEXT,
  zones_description TEXT,
  concept_title TEXT,
  concept_description TEXT,
  features_title TEXT,
  features_description TEXT,
  objectives_title TEXT,
  objectives_description TEXT,
  model_title TEXT,
  model_text_1 TEXT,
  model_text_2 TEXT,
  model_quote TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biosphere Gallery Table
CREATE TABLE IF NOT EXISTS biosphere_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biosphere_id UUID REFERENCES biosphere(id) ON DELETE CASCADE,
  url VARCHAR(500),
  alt VARCHAR(255),
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biosphere Zones Table
CREATE TABLE IF NOT EXISTS biosphere_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biosphere_id UUID REFERENCES biosphere(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size VARCHAR(100),
  description TEXT,
  zone_type VARCHAR(50), -- 'core', 'buffer', 'transition'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biosphere Zone Features Table
CREATE TABLE IF NOT EXISTS biosphere_zone_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES biosphere_zones(id) ON DELETE CASCADE,
  feature VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biosphere Features Table (Ecological Treasures)
CREATE TABLE IF NOT EXISTS biosphere_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biosphere_id UUID REFERENCES biosphere(id) ON DELETE CASCADE,
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biosphere Objectives Table (UNESCO Recognition)
CREATE TABLE IF NOT EXISTS biosphere_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biosphere_id UUID REFERENCES biosphere(id) ON DELETE CASCADE,
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parks_slug ON parks(slug);
CREATE INDEX IF NOT EXISTS idx_parks_created_at ON parks(created_at);
CREATE INDEX IF NOT EXISTS idx_iccas_name ON iccas(name);
CREATE INDEX IF NOT EXISTS idx_iccas_created_at ON iccas(created_at);
CREATE INDEX IF NOT EXISTS idx_park_features_park_id ON park_features(park_id);
CREATE INDEX IF NOT EXISTS idx_park_gallery_park_id ON park_gallery(park_id);
CREATE INDEX IF NOT EXISTS idx_icca_gallery_icca_id ON icca_gallery(icca_id);
CREATE INDEX IF NOT EXISTS idx_biosphere_name ON biosphere(name);
CREATE INDEX IF NOT EXISTS idx_biosphere_created_at ON biosphere(created_at);
CREATE INDEX IF NOT EXISTS idx_biosphere_zones_biosphere_id ON biosphere_zones(biosphere_id);
CREATE INDEX IF NOT EXISTS idx_biosphere_zone_features_zone_id ON biosphere_zone_features(zone_id);
CREATE INDEX IF NOT EXISTS idx_biosphere_features_biosphere_id ON biosphere_features(biosphere_id);
CREATE INDEX IF NOT EXISTS idx_biosphere_objectives_biosphere_id ON biosphere_objectives(biosphere_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;
ALTER TABLE park_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE park_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE iccas ENABLE ROW LEVEL SECURITY;
ALTER TABLE icca_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosphere ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosphere_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosphere_zone_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosphere_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosphere_objectives ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (for website visitors)
CREATE POLICY "Public read access for parks" ON parks FOR SELECT USING (true);
CREATE POLICY "Public read access for park_features" ON park_features FOR SELECT USING (true);
CREATE POLICY "Public read access for park_gallery" ON park_gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for iccas" ON iccas FOR SELECT USING (true);
CREATE POLICY "Public read access for icca_gallery" ON icca_gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for biosphere" ON biosphere FOR SELECT USING (true);
CREATE POLICY "Public read access for biosphere_zones" ON biosphere_zones FOR SELECT USING (true);
CREATE POLICY "Public read access for biosphere_zone_features" ON biosphere_zone_features FOR SELECT USING (true);
CREATE POLICY "Public read access for biosphere_features" ON biosphere_features FOR SELECT USING (true);
CREATE POLICY "Public read access for biosphere_objectives" ON biosphere_objectives FOR SELECT USING (true);

-- Admin policies (you'll need to set up authentication first)
-- These will be updated when we implement admin authentication
-- For now, all operations are public (not recommended for production)

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_parks_updated_at BEFORE UPDATE ON parks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_iccas_updated_at BEFORE UPDATE ON iccas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_biosphere_updated_at BEFORE UPDATE ON biosphere FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();