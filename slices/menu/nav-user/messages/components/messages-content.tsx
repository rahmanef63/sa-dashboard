"use client"

import { Avatar, AvatarFallback } from "shared/components/ui/avatar"
import { Card, CardContent } from "shared/components/ui/card"
import { ScrollArea } from "shared/components/ui/scroll-area"

export function MessagesContent() {
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Hey there! Just checking in...",
      time: "1 hour ago",
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "Can you review the latest design?",
      time: "2 hours ago",
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "Meeting scheduled for tomorrow",
      time: "3 hours ago",
    },
    {
      id: 4,
      sender: "Sarah Wilson",
      content: "Project update: Phase 1 complete",
      time: "4 hours ago",
    },
    {
      id: 5,
      sender: "David Brown",
      content: "New task assigned to you",
      time: "5 hours ago",
    }
  ]

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {message.sender.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {message.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
