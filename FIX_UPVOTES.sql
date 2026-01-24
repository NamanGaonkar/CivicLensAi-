-- ========================================
-- FIX UPVOTE SYSTEM
-- ========================================
-- Just run this to fix upvotes and comments

-- Create community_posts table
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

-- Copy existing posts from old table
INSERT INTO community_posts (id, user_id, user_name, content, image_url, created_at)
SELECT id, user_id, user_name, content, image_url, created_at
FROM posts
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Policies for community_posts
DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);


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
CREATE POLICY "Anyone can view upvotes" ON post_upvotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can add upvotes" ON post_upvotes;
CREATE POLICY "Users can add upvotes" ON post_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own upvotes" ON post_upvotes;
CREATE POLICY "Users can remove own upvotes" ON post_upvotes FOR DELETE USING (auth.uid() = user_id);


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
CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);


-- RPC Functions for upvotes
CREATE OR REPLACE FUNCTION increment_post_upvotes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_post_upvotes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = post_id;
END;
$$;

-- Done
SELECT 'Upvote system fixed!' as message;
