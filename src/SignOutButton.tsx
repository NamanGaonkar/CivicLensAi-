"use client";
import { toast } from "sonner";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";

export function SignOutButton() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed");
    } else {
      toast.success("Signed out successfully!");
    }
  };

  return (
    <button
      className="px-4 py-2 rounded bg-white/80 text-slate-900 border-2 border-violet-400 font-semibold hover:bg-violet-50 transition-colors shadow-sm hover:shadow"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
