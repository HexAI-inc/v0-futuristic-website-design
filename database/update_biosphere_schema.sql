-- Migration script to expand the biosphere table schema
-- Run this in your Supabase SQL Editor

ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS zones_title TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS zones_description TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS concept_title TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS concept_description TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS features_title TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS features_description TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS objectives_title TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS objectives_description TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS model_title TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS model_text_1 TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS model_text_2 TEXT;
ALTER TABLE biosphere ADD COLUMN IF NOT EXISTS model_quote TEXT;

-- Optional: Add comments to explain the fields
COMMENT ON COLUMN biosphere.zones_title IS 'Title for the functional zones section';
COMMENT ON COLUMN biosphere.zones_description IS 'Description for the functional zones section';
COMMENT ON COLUMN biosphere.concept_title IS 'Title for the biosphere concept card';
COMMENT ON COLUMN biosphere.concept_description IS 'Description for the biosphere concept card';
COMMENT ON COLUMN biosphere.features_title IS 'Title for the ecological treasures section';
COMMENT ON COLUMN biosphere.features_description IS 'Description for the ecological treasures section';
COMMENT ON COLUMN biosphere.objectives_title IS 'Title for the international recognition section';
COMMENT ON COLUMN biosphere.objectives_description IS 'Description for the international recognition section';
COMMENT ON COLUMN biosphere.model_title IS 'Title for the sustainable development model section';
COMMENT ON COLUMN biosphere.model_text_1 IS 'First paragraph for the sustainable development model';
COMMENT ON COLUMN biosphere.model_text_2 IS 'Second paragraph for the sustainable development model';
COMMENT ON COLUMN biosphere.model_quote IS 'Featured quote for the sustainable development model';
