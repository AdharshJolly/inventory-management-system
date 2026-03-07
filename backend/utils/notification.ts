import Notification, { NotificationType } from "../models/Notification";
import mongoose from "mongoose";
import {
  pushNotificationToUser,
  pushNotificationToUsers,
} from "./notificationStream";

/**
 * Creates a notification for a user.
 * @param user The ID of the recipient user
 * @param message The alert message
 * @param type The type of notification (LOW_STOCK, INFO, etc.)
 * @param link Optional link to a relevant resource (e.g., /products/123)
 */
export const createNotification = async (
  user: string | mongoose.Types.ObjectId,
  message: string,
  type: NotificationType = NotificationType.INFO,
  link?: string,
) => {
  try {
    const notification = await Notification.create({
      user,
      message,
      type,
      link,
    });

    pushNotificationToUser(notification.user.toString(), {
      type: "notification",
      notification,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    // Non-blocking, just log the error
  }
};

/**
 * Creates notifications for all managers.
 * Useful for critical system-wide alerts like low stock.
 */
import User from "../models/User";

export const notifyManagers = async (
  message: string,
  type: NotificationType = NotificationType.WARNING,
  link?: string,
) => {
  try {
    const managers = await User.find({ role: "warehouse-manager" }).select(
      "_id",
    );
    const notifications = managers.map((manager) => ({
      user: manager._id,
      message,
      type,
      link,
    }));

    if (notifications.length > 0) {
      const createdNotifications = await Notification.insertMany(notifications);
      pushNotificationToUsers(
        createdNotifications.map((doc) => doc.user.toString()),
        createdNotifications.map((doc) => ({
          type: "notification",
          notification: doc,
        })),
      );
    }
  } catch (error) {
    console.error("Failed to notify managers:", error);
  }
};
