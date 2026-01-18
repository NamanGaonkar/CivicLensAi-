import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageCircle, Send, Image as ImageIcon, X, Users, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
  image_url?: string;
  upvotes: number;
  comments?: Comment[];
}

export function CommunityFeed() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserUpvotes();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (postsData) {
        // Fetch comments for each post
        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            const { data: commentsData } = await supabase
              .from('post_comments')
              .select('*')
              .eq('post_id', post.id)
              .order('created_at', { ascending: true });

            return {
              ...post,
              comments: commentsData || []
            };
          })
        );

        setPosts(postsWithComments);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUpvotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('post_upvotes')
        .select('post_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (data) {
        setUserUpvotes(new Set(data.map(u => u.post_id)));
      }
    } catch (error) {
      console.error('Error fetching upvotes:', error);
    }
  };
  
  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Please sign in to create a post");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Get user's profile name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, display_name')
        .eq('id', user.id)
        .single();

      const userName = profile?.full_name || profile?.display_name || user.email?.split('@')[0] || 'User';

      // Insert post
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          user_name: userName,
          title: newPost.title,
          content: newPost.content,
          image_url: imageUrl
        });

      if (insertError) throw insertError;

      toast.success("Post shared with community!");
      setNewPost({ title: "", content: "" });
      setSelectedImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (error: any) {
      console.error('Error creating post:', error);
      
      // More detailed error message
      if (error.message?.includes('storage')) {
        toast.error('Failed to upload image. Make sure the post-images bucket exists.');
      } else if (error.message?.includes('posts')) {
        toast.error('Failed to create post. Make sure the posts table exists.');
      } else {
        toast.error(`Failed to create post: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to upvote");
      return;
    }

    const hasUpvoted = userUpvotes.has(postId);

    try {
      if (hasUpvoted) {
        // Remove upvote
        const { error: deleteError } = await supabase
          .from('post_upvotes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase.rpc('decrement_post_upvotes', { post_id: postId });
        if (updateError) throw updateError;

        setUserUpvotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        toast.success("Upvote removed");
      } else {
        // Add upvote
        const { error: insertError } = await supabase
          .from('post_upvotes')
          .insert({ post_id: postId, user_id: user.id });

        if (insertError) throw insertError;

        const { error: updateError } = await supabase.rpc('increment_post_upvotes', { post_id: postId });
        if (updateError) throw updateError;

        setUserUpvotes(prev => new Set(prev).add(postId));
        toast.success("Upvoted!");
      }

      fetchPosts();
    } catch (error) {
      console.error('Error updating upvote:', error);
      toast.error('Failed to update upvote');
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, display_name')
        .eq('id', user.id)
        .single();

      const userName = profile?.full_name || profile?.display_name || user.email?.split('@')[0] || 'User';

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          user_name: userName,
          text: commentText
        });

      if (error) throw error;

      toast.success("Comment added!");
      setCommentText("");
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeletePost = async (postId: string, userId: string) => {
    if (!user || user.id !== userId) {
      toast.error("You can only delete your own posts");
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Post deleted");
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Users className="w-8 h-8 text-civic-teal" />
          <h2 className="text-4xl font-bold text-slate-900">Community Feed</h2>
        </div>
        <p className="text-slate-600">Share updates, ask questions, and connect with your neighbors</p>
      </motion.div>

      {/* Create Post Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 bg-gradient-to-br from-white via-white to-civic-lightBlue/20 shadow-xl border border-civic-teal/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-civic-teal to-civic-darkBlue flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">What's on your mind?</h3>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Give your post a title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-5 py-3.5 bg-white border-2 border-civic-teal/30 rounded-xl focus:border-civic-teal focus:outline-none focus:ring-2 focus:ring-civic-teal/20 text-slate-900 placeholder-slate-400 font-medium transition-all"
          />
          
          <textarea
            placeholder="Share what's happening in your community..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows={4}
            className="w-full px-5 py-3.5 bg-white border-2 border-civic-teal/30 rounded-xl focus:border-civic-teal focus:outline-none focus:ring-2 focus:ring-civic-teal/20 text-slate-900 placeholder-slate-400 resize-none transition-all"
          />

          <AnimatePresence>
            {selectedImage && imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative overflow-hidden rounded-xl shadow-lg"
              >
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleImageSelect(null)}
                  className="absolute top-3 right-3 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-civic-teal text-civic-teal rounded-xl hover:bg-civic-teal/10 transition-all font-semibold shadow-sm"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Add Photo</span>
            </motion.button>

            <motion.button
              onClick={handleCreatePost}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Share Post
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Community Posts */}
      <div className="space-y-6">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-16 text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-civic-teal border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600">Loading posts...</p>
            </div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-16 text-center bg-gradient-to-br from-white to-civic-lightBlue/30 border border-civic-teal/20 shadow-lg"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-civic-teal/20 to-civic-darkBlue/20 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-civic-teal" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No posts yet</h3>
                <p className="text-slate-600 text-lg">Be the first to share something with your community!</p>
              </div>
            </div>
          </motion.div>
        ) : (
          posts.map((post: Post, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 bg-gradient-to-br from-white via-white to-slate-50 shadow-lg hover:shadow-xl transition-all border border-slate-200/50"
            >
              {/* Post Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-civic-teal to-civic-darkBlue flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {post.user_name?.[0] || "U"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">{post.user_name}</p>
                  <p className="text-sm text-slate-500">{new Date(post.created_at).toLocaleString()}</p>
                </div>
                {user && post.user_id === user.id && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeletePost(post.id, post.user_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Post Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{post.title}</h3>
              <p className="text-slate-700 mb-5 text-lg leading-relaxed">{post.content}</p>

              {post.image_url && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-80 object-cover rounded-xl mb-6 shadow-md" 
                />
              )}

              {/* Interaction Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border ${
                    userUpvotes.has(post.id)
                      ? "bg-gradient-to-r from-civic-teal to-civic-teal/80 text-white border-civic-teal"
                      : "bg-gradient-to-r from-civic-teal/10 to-civic-teal/5 hover:from-civic-teal/20 hover:to-civic-teal/10 border-civic-teal/20"
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${userUpvotes.has(post.id) ? "text-white fill-white" : "text-civic-teal"}`} />
                  <span className={`font-semibold ${userUpvotes.has(post.id) ? "text-white" : "text-slate-900"}`}>
                    {post.upvotes}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-civic-darkBlue/10 to-civic-darkBlue/5 hover:from-civic-darkBlue/20 hover:to-civic-darkBlue/10 transition-all border border-civic-darkBlue/20"
                >
                  <MessageCircle className="w-5 h-5 text-civic-darkBlue" />
                  <span className="text-slate-900 font-semibold">{post.comments?.length || 0}</span>
                </motion.button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {showComments === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-slate-200 space-y-4"
                  >
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.comments.map((comment: Comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 p-4 bg-slate-50 rounded-lg"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {comment.user_name[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900">{comment.user_name}</span>
                                <span className="text-xs text-slate-500">
                                  {new Date(comment.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-slate-700">{comment.text}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)}
                        className="flex-1 px-5 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-civic-teal focus:outline-none focus:ring-2 focus:ring-civic-teal/20 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleComment(post.id)}
                        className="px-5 py-3 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
