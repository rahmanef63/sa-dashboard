import { useState, useEffect } from 'react'
import { MenuItem } from '@/slices/sidebar/menu/types/'
import { getIconByName } from '@/shared/icon-picker/utils'

export function useAvailableMenuItems() {
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const items: MenuItem[] = [
      { 
        id: '1', 
        title: 'Dashboard',
        href: '/dashboard', 
        icon: 'LayoutDashboard' },
      { 
        id: '2', 
        title: 'Analytics',
        href: '/analytics', 
        icon: 'BarChart' },
      { 
        id: '3', 
        title: 'Settings',
        href: '/settings', 
        icon: 'Settings' },
      { 
        id: '4', 
        title: 'Profile',
        href: '/profile', 
        icon: 'User' },
      { 
        id: '5', 
        title: 'Messages',
        href: '/messages', 
        icon: 'MessageSquare' },
      { 
        id: '6', 
        title: 'Files',
        href: '/files', 
        icon: 'Files' },
      { 
        id: '7', 
        title: 'Tasks',
        href: '/tasks', 
        icon: 'CheckSquare' },
      { 
        id: '8', 
        title: 'Calendar',
        href: '/calendar', 
        icon: 'Calendar' },
      { 
        id: 'settings', 
        title: 'Settings',
        icon: 'Settings',
        isCollapsible: true,
        children: [
          { 
            id: 'settings-profile', 
            title: 'Profile',
            icon: 'UserCircle',
            href: '/dashboard/settings/profile',
          },
          { 
            id: 'settings-notifications', 
            title: 'Notifications',
            icon: 'Bell',
            href: '/dashboard/settings/notifications',
          },
          { 
            id: 'settings-security', 
            title: 'Security',
            icon: 'Shield',
            href: '/dashboard/settings/security',
          },
          { 
            id: 'settings-appearance', 
            title: 'Appearance',
            icon: 'Palette',
            href: '/dashboard/settings/appearance',
          }
        ]
      }
    ]

    setAvailableMenuItems(items)
  }, [])

  return availableMenuItems
}
