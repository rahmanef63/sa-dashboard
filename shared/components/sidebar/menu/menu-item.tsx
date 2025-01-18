"use client"

import { Button } from "shared/components/ui/button"
import { cn } from "shared/lib/utils"
import { MenuItemProps } from "shared/types/navigation-types"

export function MenuItem({ item, isCollapsed = false, className }: MenuItemProps) {
  if (item.children) return null

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
        isCollapsed ? "justify-center px-2" : "px-3",
        className
      )}
      onClick={() => item.href && (window.location.href = item.href)}
    >
      <div className={cn(
        "flex items-center w-full",
        !isCollapsed && "justify-between"
      )}>
        <span className="flex items-center">
          {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
          {!isCollapsed && <span className="ml-2">{item.title}</span>}
        </span>
      </div>
    </Button>
  )
}