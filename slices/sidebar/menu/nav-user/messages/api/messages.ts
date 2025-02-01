import { Message } from "../types"

export async function getMessages(): Promise<Message[]> {
  // Implement get messages API
  return []
}

export async function sendMessage(content: string): Promise<Message> {
  // Implement send message API
  throw new Error("Not implemented")
}
