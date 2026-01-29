"use client";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "./lib/supabase";

interface SignInFormProps {
  initialFlow?: "signIn" | "signUp";
  onBackToLogin?: () => void;
  onSuccess?: () => void;
  role?: 'citizen' | 'official' | 'admin';
}

export function SignInForm({ initialFlow = "signIn", onBackToLogin, onSuccess, role = 'citizen' }: SignInFormProps = {}) {
  const [flow, setFlow] = useState<"signIn" | "signUp">(initialFlow);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // additional profile fields for sign up
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div className="w-full">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          
          try {
            if (flow === "signUp") {
              // Sign up new user
              const { data, error } = await supabase.auth.signUp({
                email,
                password,
              });

              if (error) throw error;

              // After signUp, the client may or may not be signed in immediately
              // (depending on email-confirmation settings). Only attempt to
              // create/upsert the profile if there's an active session so that
              // the RLS policy (auth.uid() = id) permits the insert.
              const { data: sessionData } = await supabase.auth.getSession();
              const currentUser = sessionData?.session?.user ?? data.user;

              if (!currentUser) {
                // No active session — likely email confirmation required.
                toast.success("Account created! Please check your email to verify before signing in.");
              } else {
                // Create or update profile with role (use upsert to avoid duplicate/constraint issues)
                const profilePayload = {
                  id: currentUser.id,
                  email,
                  full_name: fullName || null,
                  display_name: displayName || null,
                  phone: phone || null,
                  city: city || null,
                  organization: organization || null,
                  bio: bio || null,
                  role: role,
                };

                try {
                  // Try upsert first (insert or update on conflict)
                  const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert(profilePayload, { returning: 'minimal' });

                  if (upsertError) {
                    console.warn('Profile upsert failed, attempting update:', upsertError);
                    // Fallback: try update (in case profile exists but upsert blocked)
                    const { error: updateError } = await supabase
                      .from('profiles')
                      .update(profilePayload)
                      .eq('id', currentUser.id);

                    if (updateError) {
                      console.error('Profile update error:', updateError);
                      toast.error('Failed to create user profile. Please contact support.');
                    }
                  }
                } catch (err) {
                  console.error('Unexpected profile creation error:', err);
                  toast.error('Failed to create user profile. Please try again.');
                }

                toast.success("Account created and profile saved!");
              }
            } else {
              // Sign in existing user
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (error) throw error;
              toast.success("Signed in successfully!");
              if (onSuccess) onSuccess();
            }
          } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error.message || "Authentication failed. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {flow === "signUp" && (
          <>
            <input
              className="auth-input-field"
              type="text"
              name="fullName"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="text"
              name="displayName"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="text"
              name="city"
              placeholder="City (optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="text"
              name="organization"
              placeholder="Organization (optional)"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <textarea
              className="auth-input-field h-24"
              name="bio"
              placeholder="Short bio (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </>
        )}
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        
        {/* Toggle between sign in and sign up */}
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-civic-teal hover:text-civic-darkBlue hover:underline font-medium cursor-pointer"
            onClick={() => {
              if (flow === "signUp" && onBackToLogin) {
                onBackToLogin();
              } else {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
              }
            }}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
    </div>
  );
}
