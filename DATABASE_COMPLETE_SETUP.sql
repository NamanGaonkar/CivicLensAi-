-- ========================================
-- CIVICLENS COMPLETE DATABASE SETUP
-- ========================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click RUN


-- ========================================
-- 1. PROFILES TABLE ENHANCEMENTS
-- ========================================

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'citizen' 
CHECK (role IN ('citizen', 'official', 'admin'));

-- Add profile picture column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add bio column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT;


-- ========================================
-- 2. REPORT RESPONSES TABLE
-- ========================================

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

-- Policies for report_responses
DROP POLICY IF EXISTS "Anyone can view responses" ON report_responses;
CREATE POLICY "Anyone can view responses" 
ON report_responses FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can create responses" ON report_responses;
CREATE POLICY "Anyone can create responses" 
ON report_responses FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update responses" ON report_responses;
CREATE POLICY "Anyone can update responses" 
ON report_responses FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Anyone can delete responses" ON report_responses;
CREATE POLICY "Anyone can delete responses" 
ON report_responses FOR DELETE 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS report_responses_report_id_idx ON report_responses(report_id);
CREATE INDEX IF NOT EXISTS report_responses_created_at_idx ON report_responses(created_at DESC);


-- ========================================
-- 3. COMMUNITY POSTS UPVOTE SYSTEM
-- ========================================

-- Create community_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrate existing data from posts table if it exists
INSERT INTO community_posts (id, user_id, user_name, content, image_url, upvotes, comments_count, created_at)
SELECT id, user_id, user_name, content, image_url, 
       COALESCE(upvotes, 0), COALESCE(comments_count, 0), created_at
FROM posts
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Policies for community_posts
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
CREATE POLICY "Anyone can view posts" 
ON community_posts FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
CREATE POLICY "Users can create posts" 
ON community_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" 
ON community_posts FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" 
ON community_posts FOR DELETE 
USING (auth.uid() = user_id);


-- Create post_upvotes table
CREATE TABLE IF NOT EXISTS post_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE post_upvotes ENABLE ROW LEVEL SECURITY;

-- Policies for post_upvotes
DROP POLICY IF EXISTS "Anyone can view upvotes" ON post_upvotes;
CREATE POLICY "Anyone can view upvotes" 
ON post_upvotes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can add upvotes" ON post_upvotes;
CREATE POLICY "Users can add upvotes" 
ON post_upvotes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own upvotes" ON post_upvotes;
CREATE POLICY "Users can remove own upvotes" 
ON post_upvotes FOR DELETE 
USING (auth.uid() = user_id);


-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Policies for post_comments
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
CREATE POLICY "Anyone can view comments" 
ON post_comments FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Users can create comments" 
ON post_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments" 
ON post_comments FOR DELETE 
USING (auth.uid() = user_id);


-- ========================================
-- 4. RPC FUNCTIONS FOR UPVOTES
-- ========================================

-- Function to increment post upvotes
CREATE OR REPLACE FUNCTION increment_post_upvotes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET upvotes = upvotes + 1
  WHERE id = post_id;
END;
$$;

-- Function to decrement post upvotes
CREATE OR REPLACE FUNCTION decrement_post_upvotes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = post_id;
END;
$$;

-- Function to increment comments count
CREATE OR REPLACE FUNCTION increment_comments_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = comments_count + 1
  WHERE id = post_id;
END;
$$;

-- Function to decrement comments count
CREATE OR REPLACE FUNCTION decrement_comments_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = post_id;
END;
$$;


-- ========================================
-- 5. REPORT STATUS UPDATE FUNCTION
-- ========================================

-- Function that bypasses RLS for status updates
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


-- ========================================
-- 6. STORAGE BUCKETS SETUP
-- ========================================

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies first
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Enable public access to avatars bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);


-- ========================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS post_upvotes_post_id_idx ON post_upvotes(post_id);
CREATE INDEX IF NOT EXISTS post_upvotes_user_id_idx ON post_upvotes(user_id);
CREATE INDEX IF NOT EXISTS post_comments_post_id_idx ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS post_comments_created_at_idx ON post_comments(created_at DESC);


-- Done!
SELECT 'Database setup complete! All tables, functions, and storage buckets created.' as message;
