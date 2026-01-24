# Role-Based Access Setup Guide

## Overview
This guide shows how to integrate the Admin and Official login pages and dashboards into your App.tsx.

## 1. Import the New Components

Add these imports to your `App.tsx`:

```typescript
import { AdminLoginPage } from "./components/AdminLoginPage";
import { OfficialLoginPage } from "./components/OfficialLoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { OfficialDashboard } from "./components/OfficialDashboard";
```

## 2. Update State Management

Add role management to your App component:

```typescript
const [userRole, setUserRole] = useState<"citizen" | "official" | "admin" | null>(null);
const [loginType, setLoginType] = useState<"citizen" | "official" | "admin">("citizen");
const [currentView, setCurrentView] = useState<"landing" | "citizen-login" | "official-login" | "admin-login" | "dashboard">("landing");
```

## 3. Fetch User Role from Database

After authentication, fetch the user's role:

```typescript
useEffect(() => {
  if (user) {
    fetchUserRole();
  }
}, [user]);

const fetchUserRole = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (error) throw error;
    setUserRole(data.role || "citizen");
  } catch (error) {
    console.error('Error fetching user role:', error);
    setUserRole("citizen"); // Default to citizen
  }
};
```

## 4. Create Login Handlers

```typescript
const handleAdminLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Verify user is an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }

    setUserRole('admin');
    setCurrentView('dashboard');
  } catch (error: any) {
    throw error;
  }
};

const handleOfficialLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Verify user is an official
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role !== 'official' && profile?.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Access denied. Official privileges required.');
    }

    setUserRole(profile.role);
    setCurrentView('dashboard');
  } catch (error: any) {
    throw error;
  }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  setUserRole(null);
  setCurrentView('landing');
};
```

## 5. Update Landing Page

Add buttons to access different portals:

```typescript
<LandingPage 
  onGetStarted={() => setCurrentView("citizen-login")}
  isAuthenticated={!!user}
/>

{/* Add these buttons to your LandingPage component */}
<div className="flex gap-4 mt-6">
  <button 
    onClick={() => setCurrentView("citizen-login")}
    className="px-6 py-3 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white rounded-xl"
  >
    Citizen Login
  </button>
  <button 
    onClick={() => setCurrentView("official-login")}
    className="px-6 py-3 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white rounded-xl"
  >
    Official Login
  </button>
  <button 
    onClick={() => setCurrentView("admin-login")}
    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl"
  >
    Admin Login
  </button>
</div>
```

## 6. Update Main Render Logic

```typescript
return (
  <div className="min-h-screen">
    {/* Landing Page */}
    {currentView === "landing" && (
      <LandingPage 
        onGetStarted={() => setCurrentView("citizen-login")}
        isAuthenticated={!!user}
      />
    )}

    {/* Admin Login */}
    {currentView === "admin-login" && (
      <AdminLoginPage
        onLogin={handleAdminLogin}
        onBackToHome={() => setCurrentView("landing")}
      />
    )}

    {/* Official Login */}
    {currentView === "official-login" && (
      <OfficialLoginPage
        onLogin={handleOfficialLogin}
        onBackToHome={() => setCurrentView("landing")}
      />
    )}

    {/* Citizen Login */}
    {currentView === "citizen-login" && !user && (
      <div className="min-h-screen bg-gradient-to-br from-civic-lightBlue/30 via-white to-civic-teal/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button
            onClick={() => setCurrentView("landing")}
            className="mb-6 text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Home
          </button>
          <SignInForm />
        </div>
      </div>
    )}

    {/* Dashboard - Role-Based */}
    {user && currentView === "dashboard" && (
      <>
        {userRole === "admin" && (
          <AdminDashboard onLogout={handleLogout} />
        )}

        {userRole === "official" && (
          <OfficialDashboard 
            onLogout={handleLogout}
            userEmail={user.email || ""}
          />
        )}

        {userRole === "citizen" && (
          <div>
            {/* Your existing citizen dashboard */}
            <Dashboard />
            {/* Navigation, etc. */}
          </div>
        )}
      </>
    )}

    <Toaster position="top-right" />
    <AIChatbot />
  </div>
);
```

## 7. Database Setup

Run the SQL commands in `SUPABASE_SETUP.md` to:
1. Add `role` column to profiles table
2. Create `report_responses` table
3. Update RLS policies for role-based access

## 8. Testing

### Create Test Users

1. **Admin User**:
   - Sign up normally
   - Manually update role in Supabase:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'admin@civiclens.com';
     ```

2. **Official User**:
   - Sign up normally
   - Manually update role in Supabase:
     ```sql
     UPDATE profiles SET role = 'official' WHERE email = 'official@gov.in';
     ```

### Test Flow

1. Visit landing page
2. Click "Admin Login" → Enter admin credentials
3. Should see AdminDashboard with user management
4. Logout
5. Click "Official Login" → Enter official credentials
6. Should see OfficialDashboard with reports to respond to
7. Add a response to a report
8. Logout and login as citizen
9. Should see official's response on your report

## Features

### Admin Dashboard
- View all users with roles
- Change user roles (citizen ↔ official ↔ admin)
- Suspend/ban users
- View all reports
- System settings

### Official Dashboard
- View all citizen reports
- Filter by status (open, in progress, resolved)
- Add responses to reports
- Update report status
- See response history

### Citizen Dashboard (Existing)
- Submit reports
- View own reports
- See official responses
- Track report status

## Security Notes

1. Always verify roles server-side (Supabase RLS policies)
2. Don't trust client-side role checks alone
3. Log all admin actions for audit trail
4. Implement session timeouts
5. Use two-factor authentication for admin accounts
