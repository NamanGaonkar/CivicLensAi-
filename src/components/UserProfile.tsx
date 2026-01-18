import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building2, Save, Camera } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    upvotes: 0
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    displayName: "",
    email: user?.email || "",
    phone: "",
    city: "",
    state: "",
    organization: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfileData({
          fullName: data.full_name || "",
          displayName: data.display_name || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          city: data.city || "",
          state: data.state || "",
          organization: data.organization || "",
          bio: data.bio || ""
        });
      } else {
        // Set email from user if no profile exists
        setProfileData(prev => ({ ...prev, email: user?.email || "" }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get total reports by user
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id, status')
        .eq('user_id', user?.id);

      if (reportsError) throw reportsError;

      const totalReports = reports?.length || 0;
      const resolvedReports = reports?.filter(r => r.status === 'resolved').length || 0;

      // Get total upvotes on user's reports
      const { data: upvotesData, error: upvotesError } = await supabase
        .from('reports')
        .select('upvotes')
        .eq('user_id', user?.id);

      if (upvotesError) throw upvotesError;

      const totalUpvotes = upvotesData?.reduce((sum, r) => sum + (r.upvotes || 0), 0) || 0;

      setStats({
        totalReports,
        resolvedReports,
        upvotes: totalUpvotes
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profileData.fullName,
          display_name: profileData.displayName,
          phone: profileData.phone,
          city: profileData.city,
          state: profileData.state,
          organization: profileData.organization,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("Avatar uploaded! (Backend integration pending)");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-civic-teal text-white font-semibold rounded-xl"
            >
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-civic-teal to-civic-darkBlue flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              {profileData.fullName ? profileData.fullName[0].toUpperCase() : profileData.email ? profileData.email[0].toUpperCase() : 'U'}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <Camera className="w-5 h-5 text-civic-teal" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-4">
            {profileData.fullName || profileData.email || "User"}
          </h3>
          <p className="text-slate-600">
            {profileData.displayName ? `@${profileData.displayName}` : profileData.email}
          </p>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* City */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>City</span>
            </label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* State */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>State</span>
            </label>
            <input
              type="text"
              value={profileData.state}
              onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* Organization */}
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
              <Building2 className="w-4 h-4" />
              <span>Organization</span>
            </label>
            <input
              type="text"
              value={profileData.organization}
              onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-xl shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Activity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">Activity Stats</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-civic-teal border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-civic-lightBlue/20 rounded-xl">
              <div className="text-3xl font-bold text-civic-teal">{stats.totalReports}</div>
              <div className="text-sm text-slate-600">Reports Filed</div>
            </div>
            <div className="text-center p-4 bg-civic-lightBlue/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{stats.resolvedReports}</div>
              <div className="text-sm text-slate-600">Issues Resolved</div>
            </div>
            <div className="text-center p-4 bg-civic-lightBlue/20 rounded-xl">
              <div className="text-3xl font-bold text-accent-orange">{stats.upvotes}</div>
              <div className="text-sm text-slate-600">Total Upvotes</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
