-- Home Page Settings Table
CREATE TABLE IF NOT EXISTS home_page_settings (
    section_id VARCHAR(100) PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE home_page_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public to view home_page_settings" ON home_page_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to update home_page_settings" ON home_page_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed Hero Section
INSERT INTO home_page_settings (section_id, content)
VALUES (
    'hero',
    '{
        "title": "The Gambia''s Biodiversity Outlook",
        "subtitle": "Journey through national parks, community sanctuaries, and biosphere zones shaping a resilient future.",
        "button_text": "Start Exploring"
    }'::jsonb
)
ON CONFLICT (section_id) DO UPDATE SET content = EXCLUDED.content;

-- Seed Stats Section
INSERT INTO home_page_settings (section_id, content)
VALUES (
    'stats',
    '{
        "title": "Gambia''s Biodiversity Outlook",
        "subtitle": "A snapshot of the conservation network safeguarding riverine forests, mangrove deltas, and sacred community groves across the country.",
        "stats": [
            {
                "value": 246.5,
                "suffix": "k ha",
                "label": "National Protected Estate",
                "description": "Combined coverage of parks, reserves, ICCAs, and biosphere zones",
                "decimals": 1
            },
            {
                "value": 21.81,
                "suffix": "%",
                "label": "Land & Coastal Protection",
                "description": "Portion of The Gambia currently under formal conservation",
                "decimals": 2
            },
            {
                "value": 14.3,
                "suffix": "k ha",
                "label": "Community Conserved Areas",
                "description": "Grassroots stewardship across 19 Indigenous & community sites",
                "decimals": 1
            },
            {
                "value": 530,
                "suffix": "+",
                "label": "Bird Species Recorded",
                "description": "Migratory and resident species spanning river, forest, and coast",
                "decimals": 0
            }
        ]
    }'::jsonb
)
ON CONFLICT (section_id) DO UPDATE SET content = EXCLUDED.content;

-- Seed Visual Story Section
INSERT INTO home_page_settings (section_id, content)
VALUES (
    'visual_story',
    '{
        "title": "A Glimpse of The Gambia''s Soul",
        "subtitle": "Scroll through the diverse landscapes that make The Gambia a conservation treasure"
    }'::jsonb
)
ON CONFLICT (section_id) DO UPDATE SET content = EXCLUDED.content;

-- Seed Featured Areas Section
INSERT INTO home_page_settings (section_id, content)
VALUES (
    'featured_areas',
    '{
        "title": "Featured Conservation Areas",
        "subtitle": "Explore some of the most significant protected sites across the country",
        "areas": [
            {
                "id": "kiang-west",
                "name": "Kiang West National Park",
                "type": "National Park",
                "description": "The country''s flagship wilderness with rolling savannas, mangroves, and tidal creeks that shelter antelope, hyena, and 300+ bird species.",
                "size": "29,051 ha",
                "established": "1987",
                "link": "/parks/kiang-west"
            },
            {
                "id": "boa-bolong",
                "name": "Boa Bolong Wetland Reserve",
                "type": "Wetland Reserve",
                "description": "A labyrinth of mangrove channels along the Gambia River—prime territory for spotting West African manatees, dolphins, and wading birds.",
                "size": "29,650 ha",
                "established": "1993",
                "link": "/parks/boa-bolong"
            },
            {
                "id": "tanbi",
                "name": "Tanbi Wetland National Park",
                "type": "Urban Wetland Park",
                "description": "Banjul''s green buffer—a UNESCO Ramsar site where mangroves, mudflats, and fisheries sustain coastal communities and migratory birds.",
                "size": "6,034 ha",
                "established": "2001",
                "link": "/parks/tanbi-wetland"
            }
        ]
    }'::jsonb
)
ON CONFLICT (section_id) DO UPDATE SET content = EXCLUDED.content;

-- Seed Gallery Images (3rd Normal Form)
-- These use placeholder URLs that will be replaced by actual uploads in the Media Library
INSERT INTO home_page_gallery (url, alt, caption, section_id, sort_order)
VALUES 
('https://images.unsplash.com/photo-1501854140801-50d01698950b', 'Gambia Landscape', 'Hero background image', 'hero', 0),
('https://images.unsplash.com/photo-1441974231531-c6227db76b6e', 'Lush Forests', 'Home to rare primates and vibrant birdlife.', 'visual_story', 0),
('https://images.unsplash.com/photo-1500382017468-9049fed747ef', 'Mighty Rivers', 'The lifeblood of the nation.', 'visual_story', 1),
('https://images.unsplash.com/photo-1470770841072-f978cf4d019e', 'Pristine Coastlines', 'Where vital mangrove ecosystems meet the Atlantic.', 'visual_story', 2),
('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d', 'Kiang West', 'Featured area image', 'featured_areas', 0),
('https://images.unsplash.com/photo-1447752875215-b2761acb3c5d', 'Boa Bolong', 'Featured area image', 'featured_areas', 1),
('https://images.unsplash.com/photo-1472214103451-9374bd1c798e', 'Tanbi Wetland', 'Featured area image', 'featured_areas', 2)
ON CONFLICT DO NOTHING;

