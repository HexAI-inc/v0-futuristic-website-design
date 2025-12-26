-- Create home_page_gallery table
CREATE TABLE IF NOT EXISTS home_page_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    alt TEXT,
    caption TEXT,
    section_id VARCHAR(100) REFERENCES home_page_settings(section_id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE home_page_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on home_page_gallery"
ON home_page_gallery FOR SELECT
TO public
USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on home_page_gallery"
ON home_page_gallery FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add some initial images from the current home page content
-- Note: These URLs should match what's in the home_page_settings or be placeholders
INSERT INTO home_page_gallery (url, alt, caption, section_id, sort_order)
VALUES 
('/hero-bg.jpg', 'Gambia Landscape', 'Hero background image', 'hero', 1),
('/visual-story-1.jpg', 'Wildlife in Gambia', 'Visual story image 1', 'visual_story', 1),
('/visual-story-2.jpg', 'Mangroves', 'Visual story image 2', 'visual_story', 2),
('/kiang-west-national-park-gambia-savanna-landscape.jpg', 'Kiang West', 'Featured area image', 'featured_areas', 1),
('/baobolong-bird-habitat.jpg', 'Boa Bolong', 'Featured area image', 'featured_areas', 2);
