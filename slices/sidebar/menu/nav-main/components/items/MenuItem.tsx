"use client"

import React from 'react'
import Link from 'next/link'
import { MenuItem as MenuItemType } from '@/slices/sidebar/menu/types/'
import { SidebarMenuItem, SidebarMenuButton } from "shared/components/ui/sidebar"
import { cn } from '@/shared/lib/utils'

interface MenuItemProps {
  item: MenuItemType
  className?: string
  isCollapsed?: boolean
  renderIcon?: (icon: string | undefined) => JSX.Element | null
  onEdit?: (item: MenuItemType) => void
  onDelete?: (itemId: string) => void
}

export function MenuItem({
  item,
  className,
  isCollapsed = false,
  renderIcon,
  onEdit,
  onDelete
}: MenuItemProps) {
  return (
    <SidebarMenuItem className={cn('relative group', className)}>
      <SidebarMenuButton asChild>
        <Link 
          href={item.url?.href ? (item.url.href.startsWith('/') ? item.url.href : `/dashboard${item.url.href}`) : '/dashboard'}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
            isCollapsed ? "justify-center px-2" : "px-3",
            "flex items-center"
          )}
        >
          {renderIcon?.(item.icon) && (
            <div className={cn(
              "flex items-center justify-center",
              isCollapsed ? "mx-0" : "mr-2"
            )} aria-hidden="true">
              {renderIcon(item.icon)}
            </div>
          )}
          {!isCollapsed && <span className="truncate">{item.name}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}