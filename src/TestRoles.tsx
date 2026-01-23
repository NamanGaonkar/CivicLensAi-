import { AdminLoginPage } from "./components/AdminLoginPage";
import { OfficialLoginPage } from "./components/OfficialLoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { OfficialDashboard } from "./components/OfficialDashboard";
import { useState } from "react";
import { Toaster } from "sonner";

export default function TestRoles() {
  const [view, setView] = useState<"menu" | "admin-login" | "official-login" | "admin-dash" | "official-dash">("menu");

  if (view === "admin-login") {
    return (
      <>
        <AdminLoginPage
          onLogin={async (email, password) => {
            console.log("Admin attempting login:", email);
            // Simulate successful login
            setTimeout(() => setView("admin-dash"), 1000);
          }}
          onBackToHome={() => setView("menu")}
        />
        <Toaster />
      </>
    );
  }

  if (view === "official-login") {
    return (
      <>
        <OfficialLoginPage
          onLogin={async (email, password) => {
            console.log("Official attempting login:", email);
            // Simulate successful login
            setTimeout(() => setView("official-dash"), 1000);
          }}
          onBackToHome={() => setView("menu")}
        />
        <Toaster />
      </>
    );
  }

  if (view === "admin-dash") {
    return (
      <>
        <AdminDashboard onLogout={() => setView("menu")} />
        <Toaster />
      </>
    );
  }

  if (view === "official-dash") {
    return (
      <>
        <OfficialDashboard
          onLogout={() => setView("menu")}
          userEmail="official@test.com"
        />
        <Toaster />
      </>
    );
  }

  // Main menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
          🧪 Test Role-Based Access
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => setView("admin-login")}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            🛡️ Admin Login Page
          </button>

          <button
            onClick={() => setView("official-login")}
            className="w-full py-4 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            👔 Official Login Page
          </button>

          <button
            onClick={() => setView("admin-dash")}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            📊 Admin Dashboard
          </button>

          <button
            onClick={() => setView("official-dash")}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            📋 Official Dashboard
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Click any button to preview that component. Use the back button to return here.
          </p>
        </div>
      </div>
    </div>
  );
}
