import React from 'react'
import {
  SidebarMenuSub as UISidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "shared/components/ui/sidebar"
import { SubMenuItem, MenuItem } from 'shared/types/navigation-types'
import { Button } from "shared/components/ui/button"
import { Edit, Trash } from 'lucide-react'
import { useSubmenuAvailability } from '../../hooks'
import { cn } from '@/shared/lib/utils'

interface SidebarMenuSubProps {
  items: SubMenuItem[]
  parentItem: MenuItem
  onEdit?: (item: SubMenuItem) => void
  onDelete?: (id: string) => void
  className?: string
}

export function SidebarMenuSub({ 
  items, 
  parentItem,
  onEdit,
  onDelete,
  className 
}: SidebarMenuSubProps) {
  const { isAvailable } = useSubmenuAvailability({ item: parentItem })

  if (!items || items.length === 0 || !isAvailable) return null

  return (
    <UISidebarMenuSub className={className}>
      {items.map((subItem) => (
        <SidebarMenuSubItem key={subItem.id} className="group">
          <SidebarMenuSubButton asChild>
            <a 
              href={subItem.url.href}
              target={subItem.url.target}
              rel={subItem.url.rel}
              className="flex items-center w-full"
            >
              <span className="truncate">{subItem.title}</span>
            </a>
          </SidebarMenuSubButton>
          {(onEdit || onDelete) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(subItem)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(subItem.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </SidebarMenuSubItem>
      ))}
    </UISidebarMenuSub>
  )
}
