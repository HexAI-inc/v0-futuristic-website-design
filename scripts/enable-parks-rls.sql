-- Enable RLS on parks table
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for admin interface
-- This allows SELECT, INSERT, UPDATE, DELETE for all users
-- In production, you'd want more restrictive policies based on authentication
CREATE POLICY "Allow all operations on parks" ON parks
FOR ALL USING (true);