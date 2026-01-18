# Supabase Database Setup

## Run these SQL commands in your Supabase SQL Editor

Go to: https://tovovzcnrthuhfeohxbi.supabase.co → SQL Editor → New Query

---

## 1. Create Profiles Table

```sql
-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  organization TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

---

## 2. Create Reports Table

```sql
-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  area TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  tags TEXT[],
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports
CREATE POLICY "Anyone can view reports" 
  ON reports FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create reports" 
  ON reports FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own reports" 
  ON reports FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" 
  ON reports FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX reports_user_id_idx ON reports(user_id);
CREATE INDEX reports_status_idx ON reports(status);
CREATE INDEX reports_created_at_idx ON reports(created_at DESC);
CREATE INDEX reports_location_idx ON reports(latitude, longitude);
```

---

## 3. Create Comments Table

```sql
-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Anyone can view comments" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own comments" 
  ON comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX comments_report_id_idx ON comments(report_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);
```

---

## 4. Create Upvotes Table

```sql
-- Upvotes table (to track who upvoted what)
CREATE TABLE upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Policies for upvotes
CREATE POLICY "Anyone can view upvotes" 
  ON upvotes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can upvote" 
  ON upvotes FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can remove own upvotes" 
  ON upvotes FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX upvotes_report_id_idx ON upvotes(report_id);
CREATE INDEX upvotes_user_id_idx ON upvotes(user_id);
```

---

## 5. Create Storage Bucket for Images

Go to: **Storage** → **New Bucket**

- **Name**: `report-images`
- **Public**: ✅ Yes (so images can be displayed)
- Click **Create**

Then set the storage policy:

```sql
-- Storage policy for report images
CREATE POLICY "Anyone can view report images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 6. Enable Email Auth

Go to: **Authentication** → **Settings** → **Auth Providers**

1. **Enable Email provider** (should be on by default)
2. **Confirm email**: Turn OFF (for faster testing) or ON (for production)
3. **Email templates**: You can customize the OTP email template later

---

## 7. Optional: Add Demo Data (Goa, India locations)

```sql
-- Insert demo reports with Goa locations
INSERT INTO reports (title, description, category, latitude, longitude, address, area, city, state, pincode, status, priority)
VALUES 
  -- Critical/Open issues (will show RED on map)
  ('Large Pothole on NH66', 'Deep pothole causing accidents near Patto Bridge', 'Infrastructure', 15.4909, 73.8278, 'NH66 Highway', 'Patto', 'Panaji', 'Goa', '403001', 'open', 'critical'),
  
  ('Street Light Not Working', 'Multiple street lights broken on MG Road affecting safety', 'Safety', 15.4989, 73.8245, 'MG Road', 'Campal', 'Panaji', 'Goa', '403001', 'open', 'high'),
  
  ('Illegal Garbage Dumping', 'Construction waste dumped near Miramar Beach', 'Environment', 15.4537, 73.8046, 'Beach Road', 'Miramar', 'Panaji', 'Goa', '403001', 'open', 'high'),
  
  -- In Progress issues (will show YELLOW/ORANGE on map)
  ('Water Pipeline Leakage', 'Major water leak on Rua de Ourem causing flooding', 'Utilities', 15.4868, 73.8280, 'Rua de Ourem', 'Fontainhas', 'Panaji', 'Goa', '403001', 'in_progress', 'medium'),
  
  ('Road Repair Needed', 'Road damage near Margao Municipal Market', 'Infrastructure', 15.2708, 73.9507, 'Market Road', 'Margao', 'Margao', 'Goa', '403601', 'in_progress', 'medium'),
  
  ('Park Maintenance Required', 'Children park equipment broken at Azad Maidan', 'Parks & Recreation', 15.4950, 73.8301, 'Azad Maidan', 'Panaji', 'Panaji', 'Goa', '403001', 'in_progress', 'low'),
  
  -- Resolved issues (will show GREEN on map)
  ('Traffic Signal Malfunction', 'Traffic light fixed at Ponda Circle', 'Transportation', 15.4010, 74.0077, 'Ponda Circle', 'Ponda', 'Ponda', 'Goa', '403401', 'resolved', 'medium'),
  
  ('Drainage Blockage Cleared', 'Drainage system cleaned near Mapusa Market', 'Utilities', 15.5964, 73.8153, 'Market Area', 'Mapusa', 'Mapusa', 'Goa', '403507', 'resolved', 'medium'),
  
  ('Street Cleaning Done', 'Garbage collection improved in Calangute beach area', 'Environment', 15.5438, 73.7551, 'Calangute Beach Road', 'Calangute', 'Calangute', 'Goa', '403516', 'resolved', 'low');
```

**Status Color Coding:**
- `open` with `critical` or `high` priority → **RED markers**
- `open` with `medium` or `low` priority → **ORANGE markers**
- `in_progress` → **YELLOW/AMBER markers**
- `resolved` → **GREEN markers**
- `closed` → **GRAY markers**

---

## 4. Create Community Posts Tables

```sql
-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts
CREATE POLICY "Anyone can view posts" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);

-- Post Comments table
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Anyone can view comments" 
  ON post_comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON post_comments FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own comments" 
  ON post_comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX post_comments_post_id_idx ON post_comments(post_id);
CREATE INDEX post_comments_created_at_idx ON post_comments(created_at);

-- Post Upvotes table
CREATE TABLE post_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE post_upvotes ENABLE ROW LEVEL SECURITY;

-- Policies for upvotes
CREATE POLICY "Anyone can view upvotes" 
  ON post_upvotes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can upvote" 
  ON post_upvotes FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can remove own upvotes" 
  ON post_upvotes FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX post_upvotes_post_id_idx ON post_upvotes(post_id);
CREATE INDEX post_upvotes_user_id_idx ON post_upvotes(user_id);

-- Functions to increment/decrement post upvotes
CREATE OR REPLACE FUNCTION increment_post_upvotes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET upvotes = upvotes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_post_upvotes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Create Storage Bucket for Post Images

Go to: Storage → Create a new bucket

**Bucket name:** `post-images`  
**Public bucket:** ✅ Yes

Then add this policy in the bucket policies:

```sql
-- Allow anyone to read post images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'post-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```
