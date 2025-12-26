-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    category VARCHAR(50) NOT NULL, -- 'conservation-guide', 'visit-information', 'research-data'
    icon VARCHAR(50),
    file_url TEXT,
    file_type VARCHAR(50),
    file_size VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read on resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow admin all on resources" ON resources FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Resource Attachments Table (for multiple files per resource)
CREATE TABLE IF NOT EXISTS resource_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for attachments
ALTER TABLE resource_attachments ENABLE ROW LEVEL SECURITY;

-- Policies for attachments
CREATE POLICY "Allow public read on resource_attachments" ON resource_attachments FOR SELECT USING (true);
CREATE POLICY "Allow admin all on resource_attachments" ON resource_attachments FOR ALL USING (auth.role() = 'authenticated');

-- Seed Data for Conservation Guide
INSERT INTO resources (title, description, category, icon, sort_order)
VALUES 
('Protecting Habitats', 'Guidelines on how to minimize impact on sensitive ecosystems like mangroves and riverine forests.', 'conservation-guide', 'ShieldCheck', 0),
('Sustainable Practices', 'Practical tips for local communities and visitors to engage in sustainable resource use.', 'conservation-guide', 'Leaf', 1),
('Waste Management', 'Best practices for managing waste in and around protected areas to prevent pollution.', 'conservation-guide', 'Recycle', 2),
('Wildlife Interaction', 'Ethical guidelines for observing wildlife without causing stress or disruption to their natural behavior.', 'conservation-guide', 'Heart', 3)
ON CONFLICT DO NOTHING;

-- Seed Data for Visit Information
INSERT INTO resources (title, description, category, icon, sort_order)
VALUES 
('Planning Your Visit', 'Most parks are open from 8:00 AM to 6:00 PM. We recommend visiting during the early morning or late afternoon for the best wildlife viewing.', 'visit-information', 'Clock', 0),
('Permits & Fees', 'Entry fees vary by park. Permits can be obtained at the park entrance or at the Department of Parks and Wildlife Management headquarters.', 'visit-information', 'Ticket', 1),
('Locations & Access', 'While some parks are easily accessible from the coastal areas, others require 4x4 vehicles, especially during the rainy season.', 'visit-information', 'MapPin', 2),
('Safety Guidelines', 'Always stay on designated trails, carry plenty of water, and follow the instructions of park rangers at all times.', 'visit-information', 'AlertTriangle', 3)
ON CONFLICT DO NOTHING;

-- Seed Data for Research & Data
INSERT INTO resources (title, description, category, icon, file_type, file_size, sort_order)
VALUES 
('Annual Biodiversity Report 2024', 'Comprehensive overview of biodiversity status and conservation efforts in 2024.', 'research-data', 'FileText', 'PDF Report', '4.2 MB', 0),
('Mangrove Ecosystem Health Study', 'Detailed analysis of mangrove health across the Gambia River delta.', 'research-data', 'FileText', 'Research Paper', '2.8 MB', 1),
('Avian Population Trends in Niumi', 'Monitoring data for migratory and resident bird species in Niumi Biosphere.', 'research-data', 'BarChart', 'Data Set', '1.5 MB', 2)
ON CONFLICT DO NOTHING;
