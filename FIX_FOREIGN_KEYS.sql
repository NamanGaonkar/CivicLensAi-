-- Fix the foreign key - point to community_posts instead of posts
ALTER TABLE post_upvotes DROP CONSTRAINT IF EXISTS post_upvotes_post_id_fkey;
ALTER TABLE post_upvotes ADD CONSTRAINT post_upvotes_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

ALTER TABLE post_comments DROP CONSTRAINT IF EXISTS post_comments_post_id_fkey;
ALTER TABLE post_comments ADD CONSTRAINT post_comments_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

SELECT 'Fixed!' as message;
