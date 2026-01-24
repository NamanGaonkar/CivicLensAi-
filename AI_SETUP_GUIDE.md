# 🤖 AI Integration Setup Guide

## Google Gemini AI Setup (FREE!)

### Step 1: Get Your Free API Key

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the API key** (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 2: Add API Key to Your Project

1. **Open the `.env` file** in your project root
2. **Replace** `your_gemini_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. **Save the file**

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test the AI Chatbot

1. **Open your site** in the browser
2. **Click the chat icon** (bottom right)
3. **Ask a question** like:
   - "What is a pothole?"
   - "How do I report a streetlight issue?"
   - "What civic issues can I report?"
4. **Upload an image** of a civic issue and get AI analysis!

---

## ✨ Features Now Available

### 1. **Smart Text Responses**
- Ask questions about civic issues
- Get help categorizing problems
- Understand civic processes

### 2. **Image Analysis**
- Upload photos of potholes, broken streetlights, etc.
- AI identifies the issue type
- Suggests severity level and action needed

### 3. **Context-Aware Conversations**
- AI remembers recent messages
- Provides relevant follow-up responses
- Helps guide users through reporting

---

## 📊 Free Tier Limits

**Google Gemini Free Tier:**
- ✅ **15 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **No credit card required**
- ✅ **Generous for small-to-medium apps**

This is **more than enough** for a civic platform!

---

## 🚀 Deployment

### For Vercel/Netlify/Other Platforms:

1. **Add environment variable** in your hosting dashboard:
   - Variable name: `VITE_GEMINI_API_KEY`
   - Value: Your API key

2. **Redeploy** your site

---

## 🔒 Security Notes

- ✅ `.env` is already in `.gitignore` (your key is safe)
- ✅ API key is only used in client-side (fine for Gemini)
- ✅ For production, consider using a backend proxy for extra security

---

## 🛠️ Alternative Free AI Options

If you want to try others:

### **Groq** (Very Fast!)
- Free tier: 30 requests/min
- Fast inference with Llama models
- API: https://console.groq.com/

### **Hugging Face Inference API**
- Free tier available
- Many open-source models
- API: https://huggingface.co/inference-api

---

## ❓ Troubleshooting

### "AI is not configured" message?
→ Check that your `.env` file has the correct API key

### "Invalid API key" error?
→ Make sure you copied the full key from Google AI Studio

### "Rate limit reached"?
→ You've hit the free tier limit. Wait a few minutes or upgrade.

### Not working after adding key?
→ **Restart the dev server** (npm run dev)

---

## 📝 Files Modified

1. **`src/lib/gemini.ts`** - AI integration logic
2. **`src/components/AIChatbot.tsx`** - Updated to use real AI
3. **`.env`** - Store your API key here
4. **`package.json`** - Added `@google/generative-ai` package

---

## 💡 Next Steps

Want to enhance the AI further?

- Add **real-time report data** to AI context
- Create **specialized prompts** for different issue types
- Add **multi-language support**
- Implement **auto-categorization** based on user descriptions
- Add **voice input** for accessibility

---

**You're all set!** 🎉 Your CivicLens platform now has intelligent AI assistance.
