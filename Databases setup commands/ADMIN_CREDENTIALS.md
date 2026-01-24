# CivicLens Login Credentials

## 🔴 ADMIN ACCESS
**Email:** `admin@civiclens.com`  
**Password:** `admin123`

**What you'll see:**
- Red/orange themed admin dashboard
- User management table
- Role management controls
- System statistics
- Full administrative controls

## 🔵 OFFICIAL ACCESS
**Email:** `official@civiclens.com`  
**Password:** `official123`

**What you'll see:**
- Blue/teal themed official dashboard
- List of citizen reports
- Ability to respond to reports
- Status update controls (open/in_progress/resolved)
- Response history

## 🟢 CITIZEN ACCESS
Any user can sign up as a citizen through the app.

**What you'll see:**
- Normal citizen dashboard
- Report issues form
- View your submitted reports
- Community feed
- AI chatbot assistance

---

## How to Login

### Admin Dashboard:
1. Go to http://localhost:5173 (or your app URL)
2. Click "GET STARTED"
3. On UnifiedLoginPage, click the **Admin** tab (red shield icon)
4. Enter: `admin@civiclens.com` / `admin123`
5. You'll be redirected to the Admin Dashboard ✅

### Official Dashboard:
1. Click "GET STARTED"
2. On UnifiedLoginPage, click the **Official** tab (blue UserCheck icon)
3. Enter: `official@civiclens.com` / `official123`
4. You'll be redirected to the Official Dashboard ✅

### Citizen Dashboard:
1. Click the **Citizen** tab (teal User icon)
2. Click "Sign up as Citizen" 
3. Fill out signup form with any email/password
4. You'll be redirected to the Citizen Dashboard ✅

---

## Database Setup

Run [DATABASE_SETUP_SIMPLE.sql](DATABASE_SETUP_SIMPLE.sql) in Supabase SQL Editor:

1. Go to https://tovovzcnrthuhfeohxbi.supabase.co
2. Click "SQL Editor"
3. Copy entire DATABASE_SETUP_SIMPLE.sql file
4. Paste and click "Run"
5. Done! ✅

---

## ⚠️ IMPORTANT
- Admin and Official logins are **hardcoded** (no database user needed)
- Only citizens need Supabase authentication
- Database only stores citizen reports and official responses
- No role verification needed for admin/official access

