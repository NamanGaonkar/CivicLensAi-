-- ========================================
-- CIVICLENS DATABASE SETUP
-- ========================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click RUN


-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'citizen' 
CHECK (role IN ('citizen', 'official', 'admin'));


-- Drop old table if exists (to fix any issues)
DROP TABLE IF EXISTS report_responses CASCADE;


-- Create report responses table
CREATE TABLE report_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  responder_email TEXT NOT NULL,
  responder_name TEXT NOT NULL,
  response_text TEXT NOT NULL,
  status_update TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Enable security
ALTER TABLE report_responses ENABLE ROW LEVEL SECURITY;


-- Allow anyone to view responses
DROP POLICY IF EXISTS "Anyone can view responses" ON report_responses;
CREATE POLICY "Anyone can view responses" 
ON report_responses FOR SELECT 
USING (true);


-- Allow anyone to create responses
DROP POLICY IF EXISTS "Anyone can create responses" ON report_responses;
CREATE POLICY "Anyone can create responses" 
ON report_responses FOR INSERT 
WITH CHECK (true);


-- Allow anyone to update responses
DROP POLICY IF EXISTS "Anyone can update responses" ON report_responses;
CREATE POLICY "Anyone can update responses" 
ON report_responses FOR UPDATE 
USING (true);


-- Allow anyone to delete responses
DROP POLICY IF EXISTS "Anyone can delete responses" ON report_responses;
CREATE POLICY "Anyone can delete responses" 
ON report_responses FOR DELETE 
USING (true);


-- Create indexes for performance
CREATE INDEX IF NOT EXISTS report_responses_report_id_idx ON report_responses(report_id);
CREATE INDEX IF NOT EXISTS report_responses_created_at_idx ON report_responses(created_at DESC);


-- ========================================
-- FIX REPORTS TABLE POLICIES
-- ========================================
-- Create a function that bypasses RLS for status updates

CREATE OR REPLACE FUNCTION update_report_status(
  report_uuid UUID,
  new_status TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE reports 
  SET status = new_status, 
      updated_at = NOW()
  WHERE id = report_uuid;
END;
$$;


-- Done!
SELECT 'Database setup complete!' as message;