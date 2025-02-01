import { Message } from "../types"
import { MESSAGE_TYPES } from "../constants"

export function formatMessage(message: Message) {
  // Format message for display
  return {
    ...message,
    formattedTime: new Date(message.timestamp).toLocaleString()
  }
}

export function validateMessage(content: string) {
  // Validate message content
  return content.length > 0 && content.length <= 1000
}
