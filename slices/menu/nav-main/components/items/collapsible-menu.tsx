"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "shared/components/ui/button"
import { cn } from "shared/lib/utils"
import { CollapsibleMenuProps, MenuItemWithChildren } from "shared/types/navigation-types"
import { MenuItem } from "./MenuItem"
import { useIconRenderer } from "slices/menu/nav-main/hooks/items"

export function CollapsibleMenu({ item, isCollapsed = false, className, onFocus }: CollapsibleMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const renderIcon = useIconRenderer()

  if (!item.children || !item.isCollapsible) return null

  const handleClick = () => {
    setIsExpanded(!isExpanded)
    // Call onFocus when expanding the menu
    if (!isExpanded && onFocus) {
      onFocus()
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Button
        variant="ghost"
        className={cn(
          "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
          isCollapsed ? "justify-center px-2" : "px-3"
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "flex items-center w-full",
          !isCollapsed && "justify-between"
        )}>
          <span className="flex items-center">
            {item.icon && (
              <span className="h-4 w-4 shrink-0">
                {renderIcon(item.icon)}
              </span>
            )}
            {!isCollapsed && <span className="ml-2">{item.title}</span>}
          </span>
          {!isCollapsed && (
            <span className={cn(
              "transition-transform duration-200",
              isExpanded && "rotate-90"
            )}>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </Button>

      {!isCollapsed && isExpanded && item.children && (
        <div className="pl-4">
          {item.children.map((child: MenuItemWithChildren) => (
            <MenuItem
              key={child.id}
              item={child}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  )
}