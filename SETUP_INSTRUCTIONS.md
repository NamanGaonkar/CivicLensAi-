# Setup Instructions

## ⚠️ IMPORTANT: Database Setup Required

To enable the **upvote system** and **profile picture uploads**, you need to run the SQL setup in your Supabase database.

### Steps:

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Run Database Setup**
   - Open the file `DATABASE_COMPLETE_SETUP.sql` in this project
   - Copy all the SQL code
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Setup**
   - You should see a success message
   - The following will be created:
     - ✅ `community_posts` table
     - ✅ `post_upvotes` table
     - ✅ `post_comments` table
     - ✅ `report_responses` table
     - ✅ Profile columns: `avatar_url`, `bio`, `role`
     - ✅ RPC functions for upvote increment/decrement
     - ✅ Storage bucket for profile pictures
     - ✅ RLS policies for all tables

---

## Features Now Available

### 1. Upvote System ✅
- Users can upvote community posts
- Upvote counts display correctly
- Users can remove their upvotes
- Each user can only upvote a post once

### 2. Profile Pictures ✅
- Click "Edit Profile" in your profile
- Click the camera icon on your avatar
- Upload an image (max 2MB)
- Supported formats: JPG, PNG, GIF, WebP
- Profile pictures are stored in Supabase Storage

---

## Testing

### Test Upvote System:
1. Go to Community Feed
2. Click thumbs up icon on any post
3. Watch the count increment
4. Click again to remove upvote
5. Count should decrement

### Test Profile Picture:
1. Go to User Profile
2. Click "Edit Profile"
3. Click camera icon on avatar
4. Select an image file
5. Wait for upload (you'll see a spinner)
6. Profile picture should update immediately

---

## Troubleshooting

### Upvotes Not Working?
- Make sure you ran `DATABASE_COMPLETE_SETUP.sql`
- Check Supabase SQL Editor for any errors
- Verify tables exist: Go to Table Editor → Look for `post_upvotes`

### Profile Picture Upload Fails?
- Check file size (must be under 2MB)
- Verify the file is an image
- Check Supabase Storage → Look for `avatars` bucket
- Ensure RLS policies are enabled on the bucket

### Still Having Issues?
- Check browser console for errors (F12)
- Check Supabase logs in Dashboard → Logs
- Ensure you're logged in with a valid user account

---

## Environment Variables

Make sure your `.env.local` file has:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## Next Steps

After running the database setup:

1. **Test All Features**
   - Upload a profile picture
   - Try the upvote system
   - Test the AI chatbot with voice
   - Submit a report and track its status

2. **Optional Enhancements**
   - Enable dark mode (not yet implemented)
   - Add real-time notifications
   - Set up automated report status updates

3. **Deploy**
   - Run the same SQL on your production Supabase instance
   - Add environment variables to your hosting platform
   - Test thoroughly in production

---

## Support

If you encounter any issues, check:
- Supabase Dashboard → Logs
- Browser Console (F12)
- Network tab for failed requests
