-- Delete orphaned upvotes (posts that don't exist in community_posts)
DELETE FROM post_upvotes 
WHERE post_id NOT IN (SELECT id FROM community_posts);

-- Delete orphaned comments
DELETE FROM post_comments 
WHERE post_id NOT IN (SELECT id FROM community_posts);

SELECT 'Fixed!' as message;
