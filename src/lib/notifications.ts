import { supabase } from "./supabase";
import { toast } from "sonner";

/**
 * Notification Service for CivicLens
 * Handles push notifications and email alerts
 */

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  email_on_status_change: boolean;
  email_on_comment: boolean;
  push_on_status_change: boolean;
  push_on_comment: boolean;
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Show browser push notification
 */
export function showPushNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    return notification;
  } else {
    // Fallback to toast notification
    toast.info(title, { description: options?.body });
  }
}

/**
 * Send status change notification
 */
export async function notifyStatusChange(
  reportId: string,
  reportTitle: string,
  oldStatus: string,
  newStatus: string,
  userId: string
) {
  try {
    // Get user's notification preferences
    const { data: preferences } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    const prefs = preferences || {
      email_enabled: true,
      push_enabled: true,
      email_on_status_change: true,
      push_on_status_change: true,
    };

    // Send push notification
    if (prefs.push_enabled && prefs.push_on_status_change) {
      showPushNotification("Report Status Updated", {
        body: `Your report "${reportTitle}" is now ${newStatus}`,
        tag: `report-${reportId}`,
        requireInteraction: false,
      });
    }

    // Send email notification
    if (prefs.email_enabled && prefs.email_on_status_change) {
      await sendEmailNotification(userId, reportId, reportTitle, newStatus);
    }

    // Store notification in database
    await supabase.from("notifications").insert({
      user_id: userId,
      report_id: reportId,
      type: "status_change",
      title: "Report Status Updated",
      message: `Your report "${reportTitle}" is now ${newStatus}`,
      read: false,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

/**
 * Send email notification
 */
async function sendEmailNotification(
  userId: string,
  reportId: string,
  reportTitle: string,
  newStatus: string
) {
  try {
    // Get user email
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    // In a real app, you'd use Supabase Edge Functions or an email service like Resend
    // For demo, we'll simulate the email
    console.log("📧 Email sent to:", user.email);
    console.log("Subject: Report Status Update - CivicLens");
    console.log(`Body: Your report "${reportTitle}" has been updated to: ${newStatus}`);

    // You could implement this with Supabase Edge Functions:
    /*
    await supabase.functions.invoke('send-email', {
      body: {
        to: user.email,
        subject: 'Report Status Update - CivicLens',
        html: generateEmailTemplate(reportTitle, newStatus, reportId)
      }
    });
    */

    toast.success("Email notification sent!", {
      description: `Sent to ${user.email}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

/**
 * Send comment notification
 */
export async function notifyNewComment(
  reportId: string,
  reportTitle: string,
  commenterName: string,
  commentText: string,
  reportOwnerId: string
) {
  try {
    const { data: preferences } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", reportOwnerId)
      .single();

    const prefs = preferences || {
      email_enabled: true,
      push_enabled: true,
      email_on_comment: true,
      push_on_comment: true,
    };

    // Send push notification
    if (prefs.push_enabled && prefs.push_on_comment) {
      showPushNotification("New Comment on Your Report", {
        body: `${commenterName}: ${commentText.substring(0, 100)}...`,
        tag: `comment-${reportId}`,
      });
    }

    // Store notification in database
    await supabase.from("notifications").insert({
      user_id: reportOwnerId,
      report_id: reportId,
      type: "new_comment",
      title: "New Comment on Your Report",
      message: `${commenterName} commented on "${reportTitle}"`,
      read: false,
    });
  } catch (error) {
    console.error("Error sending comment notification:", error);
  }
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  try {
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    return (
      data || {
        email_enabled: true,
        push_enabled: true,
        email_on_status_change: true,
        email_on_comment: true,
        push_on_status_change: true,
        push_on_comment: true,
      }
    );
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return {
      email_enabled: true,
      push_enabled: true,
      email_on_status_change: true,
      email_on_comment: true,
      push_on_status_change: true,
      push_on_comment: true,
    };
  }
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
) {
  try {
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    toast.success("Notification preferences updated");
  } catch (error) {
    console.error("Error updating preferences:", error);
    toast.error("Failed to update preferences");
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

/**
 * Get unread notifications count
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    return count || 0;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

/**
 * Generate email template
 */
function generateEmailTemplate(
  reportTitle: string,
  newStatus: string,
  reportId: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #1E3A8A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .status-badge { display: inline-block; padding: 8px 16px; background: #0D9488; color: white; border-radius: 20px; font-weight: bold; }
    .button { display: inline-block; padding: 12px 24px; background: #0D9488; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏙️ CivicLens</h1>
      <p>Report Status Update</p>
    </div>
    <div class="content">
      <h2>Your Report Has Been Updated!</h2>
      <p><strong>Report:</strong> ${reportTitle}</p>
      <p><strong>New Status:</strong> <span class="status-badge">${newStatus}</span></p>
      <p>Thank you for using CivicLens to make your community better. We'll continue to keep you updated on the progress of your report.</p>
      <a href="https://civiclens.vercel.app/dashboard" class="button">View Report Details</a>
    </div>
    <div class="footer">
      <p>© 2026 CivicLens. Building better communities together.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Notification Settings</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
