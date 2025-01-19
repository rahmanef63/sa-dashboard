import { User } from 'shared/types/navigation-types'
import { UserMenuType } from './profile/types'

// User data with extended profile information
export const user: User & {
  bio?: string
  location?: string
  phone?: string
  website?: string
} = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
  bio: "Software developer and open source enthusiast",
  location: "San Francisco, CA",
  phone: "+1 (555) 123-4567",
  website: "https://shadcn.com"
}

// Menu items configuration
export const USER_MENU_ITEMS = [
  {
    type: 'help' as const,
    iconName: 'HelpCircle',
    label: 'Help & Support',
    shortcut: '⇧⌘H'
  },
  {
    type: 'messages' as const,
    iconName: 'MessageSquare',
    label: 'Messages',
    shortcut: '⇧⌘M'
  },
  {
    type: 'notifications' as const,
    iconName: 'Bell',
    label: 'Notifications',
    shortcut: '⇧⌘N'
  },
  {
    type: 'privacy' as const,
    iconName: 'Lock',
    label: 'Privacy Settings',
    shortcut: '⇧⌘V'
  },
  {
    type: 'profile' as const,
    iconName: 'User',
    label: 'Profile',
    shortcut: '⇧⌘P'
  },
  {
    type: 'settings' as const,
    iconName: 'Settings',
    label: 'Settings',
    shortcut: '⇧⌘S'
  }
]

// Navigation menu configuration
export const navUserConfig = [
  { type: 'help' as const },
  { type: 'messages' as const },
  { type: 'notifications' as const },
  { type: 'privacy' as const },
  { type: 'profile' as const },
  { type: 'settings' as const }
]

// Mock logout function (replace with actual implementation)
export const logout = async () => {
  // Add your logout logic here
  console.log('Logging out...')
}
