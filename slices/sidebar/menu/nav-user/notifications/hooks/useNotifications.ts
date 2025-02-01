import { Notification } from "../types"

export function useNotifications() {
  // Add notifications functionality here
  return {
    notifications: [] as Notification[],
    markAsRead: (id: string) => {
      // Implement mark as read logic
    },
    clearAll: () => {
      // Implement clear all logic
    }
  }
}
