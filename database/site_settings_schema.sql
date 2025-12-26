-- Site Settings Table for Footer and other global configs
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public to view site_settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admins to update site_settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed Footer Data
INSERT INTO site_settings (key, value)
VALUES (
    'footer_info',
    '{
        "org_name": "Gambia Biodiversity Management",
        "org_address": "Department of Parks and Wildlife Management, Abuko Nature Reserve, The Gambia",
        "org_email": "info@nbsap.gm",
        "org_phone": "+220 123 4567",
        "org_website": "https://nbsap.gm",
        "facebook_url": "https://facebook.com/nbsapgambia",
        "twitter_url": "https://twitter.com/nbsapgambia",
        "instagram_url": "https://instagram.com/nbsapgambia",
        "linkedin_url": "https://linkedin.com/company/nbsapgambia",
        "copyright_text": "© {year} NBSAP Gambia. All rights reserved."
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
