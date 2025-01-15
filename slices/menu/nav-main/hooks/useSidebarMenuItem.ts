import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MenuItem } from '../types'

interface UseSidebarMenuItemProps {
  item: MenuItem
  defaultOpen?: boolean
}

export function useSidebarMenuItem({ item, defaultOpen = false }: UseSidebarMenuItemProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  useEffect(() => {
    // Check if current route matches the menu item or any of its children
    const isActive = router.asPath.startsWith(`/dashboard${item.url.href}`) ||
      item.items?.some(subItem => router.asPath.startsWith(`/dashboard${subItem.url}`))

    if (isActive && !isOpen) {
      setIsOpen(true)
    }
  }, [router.asPath, item, isOpen])

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    toggleOpen,
    isActive: router.asPath.startsWith(`/dashboard${item.url.href}`)
  }
}
