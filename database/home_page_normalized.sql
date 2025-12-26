-- Home Page Sections (Metadata)
CREATE TABLE IF NOT EXISTS home_page_sections (
    id VARCHAR(100) PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    button_text TEXT, -- Primarily for Hero
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Page Statistics (3NF)
CREATE TABLE IF NOT EXISTS home_page_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id VARCHAR(100) REFERENCES home_page_sections(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    suffix TEXT,
    label TEXT NOT NULL,
    description TEXT,
    decimals INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Page Featured Items (3NF)
CREATE TABLE IF NOT EXISTS home_page_featured_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id VARCHAR(100) REFERENCES home_page_sections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    size TEXT,
    established TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Page Gallery (3NF) - Already exists but ensuring it links correctly
CREATE TABLE IF NOT EXISTS home_page_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id VARCHAR(100) REFERENCES home_page_sections(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE home_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_page_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_page_featured_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_page_gallery ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read on home_page_sections" ON home_page_sections FOR SELECT USING (true);
CREATE POLICY "Allow public read on home_page_stats" ON home_page_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read on home_page_featured_items" ON home_page_featured_items FOR SELECT USING (true);
CREATE POLICY "Allow public read on home_page_gallery" ON home_page_gallery FOR SELECT USING (true);

CREATE POLICY "Allow admin all on home_page_sections" ON home_page_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on home_page_stats" ON home_page_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on home_page_featured_items" ON home_page_featured_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on home_page_gallery" ON home_page_gallery FOR ALL USING (auth.role() = 'authenticated');

-- Seed Data
INSERT INTO home_page_sections (id, title, subtitle, button_text)
VALUES 
('hero', 'The Gambia''s Biodiversity Outlook', 'Journey through national parks, community sanctuaries, and biosphere zones shaping a resilient future.', 'Start Exploring'),
('stats', 'Gambia''s Biodiversity Outlook', 'A snapshot of the conservation network safeguarding riverine forests, mangrove deltas, and sacred community groves across the country.', NULL),
('visual_story', 'A Glimpse of The Gambia''s Soul', 'Scroll through the diverse landscapes that make The Gambia a conservation treasure', NULL),
('featured_areas', 'Featured Conservation Areas', 'Explore some of the most significant protected sites across the country', NULL)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title, 
    subtitle = EXCLUDED.subtitle, 
    button_text = EXCLUDED.button_text;

-- Seed Stats
INSERT INTO home_page_stats (section_id, value, suffix, label, description, decimals, sort_order)
VALUES 
('stats', 246.5, 'k ha', 'National Protected Estate', 'Combined coverage of parks, reserves, ICCAs, and biosphere zones', 1, 0),
('stats', 21.81, '%', 'Land & Coastal Protection', 'Portion of The Gambia currently under formal conservation', 2, 1),
('stats', 14.3, 'k ha', 'Community Conserved Areas', 'Grassroots stewardship across 19 Indigenous & community sites', 1, 2),
('stats', 530, '+', 'Bird Species Recorded', 'Migratory and resident species spanning river, forest, and coast', 0, 3)
ON CONFLICT DO NOTHING;

-- Seed Featured Items
INSERT INTO home_page_featured_items (section_id, name, type, description, size, established, link, sort_order)
VALUES 
('featured_areas', 'Kiang West National Park', 'National Park', 'The country''s flagship wilderness with rolling savannas, mangroves, and tidal creeks.', '29,051 ha', '1987', '/parks/kiang-west', 0),
('featured_areas', 'Boa Bolong Wetland Reserve', 'Wetland Reserve', 'A labyrinth of mangrove channels along the Gambia River.', '29,650 ha', '1993', '/parks/boa-bolong', 1),
('featured_areas', 'Tanbi Wetland National Park', 'Urban Wetland Park', 'Banjul''s green buffer—a UNESCO Ramsar site.', '6,034 ha', '2001', '/parks/tanbi-wetland', 2)
ON CONFLICT DO NOTHING;

-- Seed Gallery
INSERT INTO home_page_gallery (section_id, url, alt, caption, sort_order)
VALUES 
('hero', 'https://images.unsplash.com/photo-1501854140801-50d01698950b', 'Gambia Landscape', 'Hero background image', 0),
('visual_story', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', 'Lush Forests', 'Home to rare primates and vibrant birdlife.', 0),
('visual_story', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef', 'Mighty Rivers', 'The lifeblood of the nation.', 1),
('visual_story', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', 'Pristine Coastlines', 'Where vital mangrove ecosystems meet the Atlantic.', 2),
('featured_areas', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d', 'Kiang West', 'Featured area image', 0),
('featured_areas', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d', 'Boa Bolong', 'Featured area image', 1),
('featured_areas', 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', 'Tanbi Wetland', 'Featured area image', 2)
ON CONFLICT DO NOTHING;
