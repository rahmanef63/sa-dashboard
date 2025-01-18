import React from 'react'
import Link from 'next/link'
import { MenuItem } from 'shared/types/navigation-types'
import { getIconComponent } from '../../utils'
import { SidebarMenuItem, SidebarMenuButton } from 'shared/components/ui/sidebar'
import { cn } from '@/shared/lib/utils'

interface NavMenuItemProps {
  item: MenuItem
  className?: string
}

export function NavMenuItem({ item, className }: NavMenuItemProps) {
  const IconComponent = getIconComponent(typeof item.icon === 'string' ? item.icon : 'FileText')
  const href = `/dashboard${item.url.href}`

  return (
    <SidebarMenuItem className={cn('relative group', className)}>
      <SidebarMenuButton asChild>
        <Link 
          href={href}
          target={item.url.target} 
          rel={item.url.rel}
          className="flex items-center w-full"
        >
          <IconComponent className="mr-2 h-4 w-4" aria-hidden="true" />
          <span className="truncate">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
