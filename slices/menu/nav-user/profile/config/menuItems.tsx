import React from 'react';
import { ReactNode } from "react"
import { UserMenuType } from "../types"
import {
  BadgeCheck,
  Bell,
  Lock,
  Mail,
  Settings,
  Shield,
  User,
  UserCircle,
  UserPlus,
  HelpCircle,
} from "lucide-react"
import {
  HelpContent,
  MessagesContent,
  NotificationsContent,
  PrivacyContent,
  ProfileContent,
  SettingsContent,
} from "../components/contents"

export const USER_MENU_ITEMS: { type: UserMenuType; icon: ReactNode; label: string; shortcut?: string }[] = [
  {
    type: "profile",
    icon: <BadgeCheck className="mr-2 h-4 w-4" />,
    label: "Account",
    shortcut: "⇧⌘P"
  },
  {
    type: "settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    label: "Settings",
    shortcut: "⌘S"
  },
  {
    type: "notifications",
    icon: <Bell className="mr-2 h-4 w-4" />,
    label: "Notifications",
    shortcut: "⌘N"
  },
  {
    type: "messages",
    icon: <Mail className="mr-2 h-4 w-4" />,
    label: "Messages",
    shortcut: "⌘M"
  },
  {
    type: "privacy",
    icon: <Shield className="mr-2 h-4 w-4" />,
    label: "Privacy"
  },
  {
    type: "help",
    icon: <HelpCircle className="mr-2 h-4 w-4" />,
    label: "Help & Support"
  }
]

export const USER_MENU_TITLES: Record<UserMenuType, string> = {
  profile: "Profile",
  messages: "Messages",
  notifications: "Notifications",
  privacy: "Privacy",
  help: "Help & Support",
  settings: "Settings",
}

export const USER_MENU_CONTENTS: Record<UserMenuType, ReactNode> = {
  help: <HelpContent />,
  messages: <MessagesContent />,
  notifications: <NotificationsContent />,
  privacy: <PrivacyContent />,
  profile: <ProfileContent />,
  settings: <SettingsContent />,
}
