-- Sync all posts to community_posts table
INSERT INTO community_posts (id, user_id, user_name, content, image_url, created_at)
SELECT id, user_id, user_name, content, image_url, created_at
FROM posts
WHERE id NOT IN (SELECT id FROM community_posts);
