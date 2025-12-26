-- Communications Table for storing visitor inquiries, support requests, and visit plans
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'support', 'visit', 'contact'
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  target_id UUID, -- ID of the ICCA, Park, or Biosphere
  target_type VARCHAR(50), -- 'icca', 'park', 'biosphere'
  target_name VARCHAR(255), -- Name of the target for easy reference
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'archived'
  metadata JSONB, -- For any additional type-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_communications_type ON communications(type);
CREATE INDEX IF NOT EXISTS idx_communications_status ON communications(status);
CREATE INDEX IF NOT EXISTS idx_communications_created_at ON communications(created_at);

-- Enable RLS
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for contact forms)
CREATE POLICY "Allow public to insert communications" ON communications
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can view/update communications
-- (Assuming we'll have an admin role later, for now we'll leave it restricted)
CREATE POLICY "Allow admins to view communications" ON communications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to update communications" ON communications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE TRIGGER update_communications_updated_at 
BEFORE UPDATE ON communications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
