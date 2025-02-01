import { Notification } from "../types"
import { NOTIFICATION_TYPES } from "../constants"

export function formatNotification(notification: Notification) {
  // Format notification for display
  return {
    ...notification,
    formattedTime: new Date(notification.timestamp).toLocaleString()
  }
}

export function getNotificationIcon(type: Notification["type"]) {
  // Return appropriate icon based on notification type
  switch (type) {
    case NOTIFICATION_TYPES.INFO:
      return "info"
    case NOTIFICATION_TYPES.WARNING:
      return "warning"
    case NOTIFICATION_TYPES.ERROR:
      return "error"
    case NOTIFICATION_TYPES.SUCCESS:
      return "success"
    default:
      return "info"
  }
}
