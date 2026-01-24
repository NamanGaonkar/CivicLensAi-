import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  requestNotificationPermission,
  NotificationPreferences,
} from "../lib/notifications";
import { useAuth } from "../hooks/useAuth";

export function NotificationSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    push_enabled: true,
    email_on_status_change: true,
    email_on_comment: true,
    push_on_status_change: true,
    push_on_comment: true,
  });
  const [pushPermissionGranted, setPushPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
      checkPushPermission();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    setLoading(true);
    const prefs = await getNotificationPreferences(user.id);
    setPreferences(prefs);
    setLoading(false);
  };

  const checkPushPermission = () => {
    if ("Notification" in window) {
      setPushPermissionGranted(Notification.permission === "granted");
    }
  };

  const handleRequestPushPermission = async () => {
    const granted = await requestNotificationPermission();
    setPushPermissionGranted(granted);
    if (granted) {
      toast.success("Push notifications enabled!");
    } else {
      toast.error("Push notification permission denied");
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    if (!user) return;

    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(newPreferences);
    await updateNotificationPreferences(user.id, newPreferences);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Notification Settings</h2>
            <p className="text-white/90 text-sm">
              Manage how you receive updates about your reports
            </p>
          </div>
        </div>
      </div>

      {/* Push Notification Permission */}
      {!pushPermissionGranted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 mb-2">
                Enable Push Notifications
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                Allow browser notifications to get instant updates when your report
                status changes or someone comments.
              </p>
              <button
                onClick={handleRequestPushPermission}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Enable Push Notifications
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6" />
            <h3 className="text-lg font-bold">Email Notifications</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">
                  Receive email updates about your reports
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("email_enabled")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.email_enabled ? "bg-civic-teal" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.email_enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {preferences.email_enabled && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg ml-8">
                <div>
                  <h4 className="font-medium text-gray-900">Status Changes</h4>
                  <p className="text-sm text-gray-600">
                    When your report status is updated
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("email_on_status_change")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.email_on_status_change
                      ? "bg-civic-teal"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.email_on_status_change
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg ml-8">
                <div>
                  <h4 className="font-medium text-gray-900">New Comments</h4>
                  <p className="text-sm text-gray-600">
                    When someone comments on your report
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("email_on_comment")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.email_on_comment ? "bg-civic-teal" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.email_on_comment
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6" />
            <h3 className="text-lg font-bold">Push Notifications</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Browser Notifications
                </h4>
                <p className="text-sm text-gray-600">
                  Instant alerts in your browser
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("push_enabled")}
              disabled={!pushPermissionGranted}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.push_enabled && pushPermissionGranted
                  ? "bg-civic-teal"
                  : "bg-gray-300"
              } ${!pushPermissionGranted ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.push_enabled && pushPermissionGranted
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {preferences.push_enabled && pushPermissionGranted && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg ml-8">
                <div>
                  <h4 className="font-medium text-gray-900">Status Changes</h4>
                  <p className="text-sm text-gray-600">
                    Instant alerts when status updates
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("push_on_status_change")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.push_on_status_change
                      ? "bg-civic-teal"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.push_on_status_change
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg ml-8">
                <div>
                  <h4 className="font-medium text-gray-900">New Comments</h4>
                  <p className="text-sm text-gray-600">
                    Alerts for new comments on your reports
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("push_on_comment")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.push_on_comment ? "bg-civic-teal" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.push_on_comment
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <Check className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-bold text-green-900">Changes Saved</h3>
            <p className="text-sm text-green-800">
              Your notification preferences are automatically saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
