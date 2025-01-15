import React from 'react'
import { ChevronRight, Edit, Trash } from 'lucide-react'
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/components/ui/collapsible"
import {
  SidebarMenuItem as UISidebarMenuItem,
  SidebarMenuButton,
} from "shared/components/ui/sidebar"
import { Button } from "shared/components/ui/button"
import { SidebarMenuItemProps } from '../../types'
import { getIconComponent } from '../../utils'
import { useSidebarMenuItem } from '../../hooks/useSidebarMenuItem'
import { cn } from '@/shared/lib/utils'

export function SidebarMenuItem({ 
  item, 
  onEdit, 
  onDelete,
  className 
}: SidebarMenuItemProps) {
  const { isOpen, toggleOpen, isActive } = useSidebarMenuItem({ item })
  const Icon = getIconComponent(item.icon)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={toggleOpen}
      className={cn("group/collapsible", className)}
    >
      <UISidebarMenuItem>
        <CollapsibleTrigger asChild>
          <Link href={`/dashboard${item.url.href}`} passHref legacyBehavior>
            <SidebarMenuButton 
              tooltip={item.title}
              className={cn(
                "w-full",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span className="truncate">{item.title}</span>
              {item.items && item.items.length > 0 && (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              )}
            </SidebarMenuButton>
          </Link>
        </CollapsibleTrigger>
        
        {item.items && item.items.length > 0 && (
          <CollapsibleContent>
            <div className="pl-6 pt-2">
              {item.items.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={`/dashboard${subItem.url}`}
                  className={cn(
                    "flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent",
                    "transition-colors duration-200"
                  )}
                >
                  <span className="truncate">{subItem.title}</span>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        )}

        {(onEdit || onDelete) && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/collapsible:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </UISidebarMenuItem>
    </Collapsible>
  )
}
