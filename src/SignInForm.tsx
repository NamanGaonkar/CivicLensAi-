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
              
              // Create profile with role
              if (data.user) {
                const { error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: data.user.id,
                    email,
                    full_name: fullName,
                    display_name: displayName,
                    phone,
                    city,
                    organization,
                    bio,
                    role: role,
                  });
                
                if (profileError) console.error('Profile creation error:', profileError);
              }
              
              toast.success("Account created! Please check your email to verify.");
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
