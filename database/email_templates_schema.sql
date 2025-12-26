-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id VARCHAR(100) PRIMARY KEY, -- slug like 'support_followup'
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view/update templates
CREATE POLICY "Allow admins to view email_templates" ON email_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to update email_templates" ON email_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE TRIGGER update_email_templates_updated_at 
BEFORE UPDATE ON email_templates 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial templates
INSERT INTO email_templates (id, name, subject, body, description)
VALUES 
(
  'support_followup', 
  'Support Follow-up', 
  'Following up on your ICCA support request', 
  '<p>Dear {{name}},</p>\n<p>Thank you for your interest in supporting <strong>{{target_name}}</strong>. We are inspired by your willingness to contribute to the protection of Gambia''s natural heritage.</p>\n<p>We would love to discuss how you can get involved. Are you available for a brief call this week to discuss the various ways you can contribute?</p>\n<p>In the meantime, you can learn more about our community-led conservation initiatives on our portal.</p>\n<p style="margin-top: 30px;">Best regards,<br>\n<strong style="color: #2d5a47;">The Gambia Biodiversity Team</strong></p>',
  'Sent when an admin follows up on a support request.'
),
(
  'visit_planning', 
  'Visit Planning Guide', 
  'Information for your visit to {{target_name}}', 
  '<p>Dear {{name}},</p>\n<p>We are excited that you are planning to visit <strong>{{target_name}}</strong>. Responsible tourism plays a vital role in supporting our conservation work.</p>\n<p>To help you prepare, we''ve put together a visitor guide which includes information on permits, local guides, and essential items to bring. You can find all the details on our website or by contacting our regional office.</p>\n<p>Please let us know if you have any specific requirements or if you''re traveling with a large group.</p>\n<p style="margin-top: 30px;">Best regards,<br>\n<strong style="color: #2d5a47;">The Gambia Biodiversity Team</strong></p>',
  'Sent when an admin provides visit planning information.'
),
(
  'general_response', 
  'General Response', 
  'Re: {{subject}}', 
  '<p>Dear {{name}},</p>\n<p>Thank you for your inquiry regarding <strong>{{subject}}</strong>.</p>\n<p>We have received your message and it has been forwarded to the relevant department. One of our team members will be in touch shortly with a detailed response to your questions.</p>\n<p>Thank you for your patience and for your interest in Gambia''s biodiversity.</p>\n<p style="margin-top: 30px;">Best regards,<br>\n<strong style="color: #2d5a47;">The Gambia Biodiversity Team</strong></p>',
  'A generic response template for any inquiry.'
)
ON CONFLICT (id) DO NOTHING;
