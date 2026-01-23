// QUICK TEST - Add this to your App.tsx temporarily to test the new components

import { AdminLoginPage } from "./components/AdminLoginPage";
import { OfficialLoginPage } from "./components/OfficialLoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { OfficialDashboard } from "./components/OfficialDashboard";
import { useState } from "react";

// Add this state at the top of your App component:
const [testView, setTestView] = useState<"landing" | "admin-login" | "official-login" | "admin-dash" | "official-dash">("landing");
const [testUserEmail, setTestUserEmail] = useState("test@example.com");

// Add these test buttons to your landing page:
<div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
  <button
    onClick={() => setTestView("admin-login")}
    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg"
  >
    Test Admin Login
  </button>
  <button
    onClick={() => setTestView("official-login")}
    className="px-4 py-2 bg-civic-teal text-white rounded-lg shadow-lg"
  >
    Test Official Login
  </button>
  <button
    onClick={() => setTestView("admin-dash")}
    className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-lg"
  >
    Test Admin Dashboard
  </button>
  <button
    onClick={() => setTestView("official-dash")}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
  >
    Test Official Dashboard
  </button>
</div>

// Add this render logic before your return statement:
if (testView === "admin-login") {
  return (
    <AdminLoginPage
      onLogin={async (email, password) => {
        console.log("Admin login:", email);
        setTestUserEmail(email);
        setTestView("admin-dash");
      }}
      onBackToHome={() => setTestView("landing")}
    />
  );
}

if (testView === "official-login") {
  return (
    <OfficialLoginPage
      onLogin={async (email, password) => {
        console.log("Official login:", email);
        setTestUserEmail(email);
        setTestView("official-dash");
      }}
      onBackToHome={() => setTestView("landing")}
    />
  );
}

if (testView === "admin-dash") {
  return (
    <AdminDashboard
      onLogout={() => setTestView("landing")}
    />
  );
}

if (testView === "official-dash") {
  return (
    <OfficialDashboard
      onLogout={() => setTestView("landing")}
      userEmail={testUserEmail}
    />
  );
}
