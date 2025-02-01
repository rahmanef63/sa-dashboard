"use client"

import { Label } from "shared/components/ui/label"
import { Switch } from "shared/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/components/ui/card"
import { Button } from "shared/components/ui/button"
import { ScrollArea } from "shared/components/ui/scroll-area"
import { Eye, Users, Activity, Lock, Shield, Bell } from "lucide-react"

export function PrivacyContent() {
  const privacySettings = [
    {
      id: "profile-visibility",
      title: "Profile Visibility",
      description: "Control who can see your profile",
      icon: Eye,
    },
    {
      id: "activity-status",
      title: "Activity Status",
      description: "Show when you're active",
      icon: Activity,
    },
    {
      id: "connection-requests",
      title: "Connection Requests",
      description: "Allow others to send you connection requests",
      icon: Users,
    },
    {
      id: "two-factor",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      icon: Lock,
    },
    {
      id: "data-sharing",
      title: "Data Sharing",
      description: "Control how your data is shared",
      icon: Shield,
    },
    {
      id: "email-notifications",
      title: "Email Notifications",
      description: "Manage email notification preferences",
      icon: Bell,
    },
  ]

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Manage your privacy preferences and account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {privacySettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <setting.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor={setting.id}>{setting.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch id={setting.id} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Security</CardTitle>
            <CardDescription>
              Review and manage your data and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Download Your Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Security Log
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
  )
}
