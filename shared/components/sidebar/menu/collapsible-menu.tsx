"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "shared/components/ui/button"
import { cn } from "shared/lib/utils"
import { CollapsibleMenuProps } from "shared/types/navigation-types"

export function CollapsibleMenu({ item, isCollapsed = false, className, onFocus }: CollapsibleMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
            {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
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

      {!isCollapsed && (
        <div className={cn(
          "pl-4 space-y-1 overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          {item.children.map((child) => (
            <Button
              key={child.id}
              variant="ghost"
              className="w-full justify-between px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => child.href && (window.location.href = child.href)}
            >
              <span className="flex items-center">
                {child.icon && <span className="h-4 w-4 shrink-0">{child.icon}</span>}
                <span className="ml-2">{child.title}</span>
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}