"use client"

import React from 'react'
import Link from 'next/link'
import { MenuItemWithChildren, MenuItemProps } from 'shared/types/navigation-types'
import { getIconComponent } from '../../utils'
import { SidebarMenuItem, SidebarMenuButton } from 'shared/components/ui/sidebar'
import { cn } from '@/shared/lib/utils'

export function MenuItem({ item, isCollapsed = false, className }: MenuItemProps) {
  const IconComponent = getIconComponent(typeof item.icon === 'string' ? item.icon : 'FileText')
  
  // If the item has children and is collapsible, it should be handled by CollapsibleMenu
  if (item.children && item.isCollapsible) return null
  
  const href = item.url?.href ? (item.url.href.startsWith('/') ? item.url.href : `/dashboard${item.url.href}`) : '/dashboard'

  return (
    <SidebarMenuItem className={cn('relative group', className)}>
      <SidebarMenuButton asChild>
        <Link 
          href={href}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
            isCollapsed ? "justify-center px-2" : "px-3",
            "flex items-center"
          )}
        >
          {IconComponent && (
            <IconComponent className={cn(
              "h-4 w-4",
              isCollapsed ? "mx-0" : "mr-2"
            )} aria-hidden="true" />
          )}
          {!isCollapsed && <span className="truncate">{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}