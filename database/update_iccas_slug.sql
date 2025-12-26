-- Add slug column to iccas table
ALTER TABLE iccas ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_icca_slug() RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    -- Remove leading/trailing hyphens
    NEW.slug := trim(both '-' from NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate slug on insert or update
DROP TRIGGER IF EXISTS trg_generate_icca_slug ON iccas;
CREATE TRIGGER trg_generate_icca_slug
BEFORE INSERT OR UPDATE ON iccas
FOR EACH ROW
EXECUTE FUNCTION generate_icca_slug();

-- Update existing ICCAs to have slugs
UPDATE iccas SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
UPDATE iccas SET slug = trim(both '-' from slug);
