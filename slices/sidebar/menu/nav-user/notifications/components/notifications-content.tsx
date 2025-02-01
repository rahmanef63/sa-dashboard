"use client"

import { Badge } from "shared/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/components/ui/card"
import { ScrollArea } from "shared/components/ui/scroll-area"
import { Bell, Gift, MessageSquare, Settings, Star } from "lucide-react"

export function NotificationsContent() {
  const notifications = [
    {
      id: 1,
      title: "New Feature Available",
      description: "Check out our latest features and improvements",
      time: "2 hours ago",
      icon: Star,
      badge: "New",
      badgeVariant: "default" as const,
    },
    {
      id: 2,
      title: "Account Security Update",
      description: "We've enhanced your account security",
      time: "5 hours ago",
      icon: Settings,
      badge: "Security",
      badgeVariant: "destructive" as const,
    },
    {
      id: 3,
      title: "New Message",
      description: "You have a new message from the team",
      time: "1 day ago",
      icon: MessageSquare,
      badge: "Message",
      badgeVariant: "secondary" as const,
    },
    {
      id: 4,
      title: "Special Offer",
      description: "Limited time offer on premium features",
      time: "2 days ago",
      icon: Gift,
      badge: "Offer",
      badgeVariant: "default" as const,
    },
    {
      id: 5,
      title: "System Update",
      description: "Important system updates and maintenance",
      time: "3 days ago",
      icon: Bell,
      badge: "System",
      badgeVariant: "secondary" as const,
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences and view recent notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <notification.icon className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{notification.title}</span>
                          <Badge variant={notification.badgeVariant}>
                            {notification.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
