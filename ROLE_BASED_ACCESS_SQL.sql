-- ========================================
-- ROLE-BASED ACCESS SYSTEM - SQL COMMANDS
-- ========================================
-- Run these commands in Supabase SQL Editor
-- Go to: https://tovovzcnrthuhfeohxbi.supabase.co → SQL Editor → New Query


-- ========================================
-- STEP 1: Add Role Column to Profiles Table
-- ========================================
-- This adds a role column if it doesn't exist yet

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'citizen' 
CHECK (role IN ('citizen', 'official', 'admin'));


-- ========================================
-- STEP 2: Add Admin Policy for Profile Management
-- ========================================
-- This allows admins to change any user's role

CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);


-- ========================================
-- STEP 3: Add Official Policy for Report Updates
-- ========================================
-- This allows officials and admins to update report status

CREATE POLICY "Officials can update reports"
ON reports FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('official', 'admin')
  )
);


-- ========================================
-- STEP 4: Create Report Responses Table
-- ========================================
-- This table stores official responses to citizen reports

CREATE TABLE report_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  responder_name TEXT NOT NULL,
  response_text TEXT NOT NULL,
  status_update TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ========================================
-- STEP 5: Enable RLS on Report Responses
-- ========================================

ALTER TABLE report_responses ENABLE ROW LEVEL SECURITY;


-- ========================================
-- STEP 6: Add Policies for Report Responses
-- ========================================

-- Anyone can view responses (so citizens can see official replies)
CREATE POLICY "Anyone can view responses" 
ON report_responses FOR SELECT 
USING (true);

-- Only officials and admins can create responses
CREATE POLICY "Officials and Admins can create responses" 
ON report_responses FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('official', 'admin')
  )
);

-- Responders can update their own responses
CREATE POLICY "Responders can update own responses" 
ON report_responses FOR UPDATE 
USING (auth.uid() = responder_id);

-- Responders can delete their own responses
CREATE POLICY "Responders can delete own responses" 
ON report_responses FOR DELETE 
USING (auth.uid() = responder_id);


-- ========================================
-- STEP 7: Create Indexes for Performance
-- ========================================

CREATE INDEX report_responses_report_id_idx ON report_responses(report_id);
CREATE INDEX report_responses_created_at_idx ON report_responses(created_at DESC);


-- ========================================
-- STEP 8: Create Test Users (OPTIONAL)
-- ========================================
-- After creating accounts normally, run these to assign roles:

-- Make a user an ADMIN (replace with actual email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@civiclens.com';

-- Make a user an OFFICIAL (replace with actual email)
-- UPDATE profiles SET role = 'official' WHERE email = 'official@gov.in';


-- ========================================
-- VERIFICATION QUERIES (OPTIONAL)
-- ========================================
-- Run these to verify everything is working:

-- Check if role column exists
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role';

-- Check all user roles
-- SELECT email, role FROM profiles;

-- Check all policies on profiles table
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check all policies on reports table
-- SELECT * FROM pg_policies WHERE tablename = 'reports';

-- Check all policies on report_responses table
-- SELECT * FROM pg_policies WHERE tablename = 'report_responses';


-- ========================================
-- DONE! 🎉
-- ========================================
-- Your role-based access system is now set up!
-- Next steps:
-- 1. Create test accounts (sign up normally)
-- 2. Assign roles using UPDATE commands above
-- 3. Test login with AdminLoginPage and OfficialLoginPage
