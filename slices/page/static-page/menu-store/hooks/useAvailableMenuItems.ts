import { useState, useEffect } from 'react'
import { MenuItem } from '../types'

export function useAvailableMenuItems() {
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    setAvailableMenuItems([
      { id: '1', title: 'Dashboard', url: { href: '/dashboard' }, icon: 'LayoutDashboard' },
      { id: '2', title: 'Analytics', url: { href: '/analytics' }, icon: 'BarChart' },
      { id: '3', title: 'Settings', url: { href: '/settings' }, icon: 'Settings' },
      { id: '4', title: 'Profile', url: { href: '/profile' }, icon: 'User' },
      { id: '5', title: 'Projects', url: { href: '/projects' }, icon: 'Folder' },
      { id: '6', title: 'Tasks', url: { href: '/tasks' }, icon: 'CheckSquare' },
      { id: '7', title: 'Messages', url: { href: '/messages' }, icon: 'MessageSquare' },
      { id: '8', title: 'Calendar', url: { href: '/calendar' }, icon: 'Calendar' },
    ])
  }, [])

  return availableMenuItems
}

