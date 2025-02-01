"use client"

import { cn } from "shared/lib/utils"
import { CollapsibleMenu } from "../items"
import { SecondaryMenu } from "../submenus/secondary-menu"
import { MenuItem } from "../items"
import { MenuSectionProps, MenuItemWithChildren } from "shared/types/navigation-types"

export function MenuSection({ 
  items, 
  title, 
  isCollapsed = false, 
  onSecondaryItemClick,
  onFocus,
  className 
}: MenuSectionProps) {
  return (
    <div className={cn("px-2 py-2", className)}>
      {title && (
        <h2 className={cn(
          "mb-2 px-2 text-xs font-semibold tracking-tight text-sidebar-foreground/70",
          isCollapsed && "sr-only"
        )}>
          {title}
        </h2>
      )}
      <nav className="space-y-1">
        {items.map((item: MenuItemWithChildren) => {
          if (item.children && item.isCollapsible) {
            return (
              <CollapsibleMenu
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                onFocus={onFocus}
              />
            )
          }
          
          if (item.children && !item.isCollapsible && onSecondaryItemClick) {
            return (
              <SecondaryMenu
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                onItemClick={onSecondaryItemClick}
              />
            )
          }
          
          return (
            <MenuItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
            />
          )
        })}
      </nav>
    </div>
  )
}
