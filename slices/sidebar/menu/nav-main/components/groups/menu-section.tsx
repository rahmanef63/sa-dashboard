"use client"

import { cn } from "shared/lib/utils"
import { CollapsibleMenu } from "../items"
import { MenuItem } from "../items"
import { MenuItem } from "@/slices/sidebar/menu/types/"

interface MenuSectionProps {
  items: MenuItem[];
  title?: string;
  type?: 'menu' | 'submenu';
  isCollapsed?: boolean;
  onSecondaryItemClick?: (item: MenuItem) => void;
  onFocus?: () => void;
  renderIcon?: (icon: string | undefined) => React.ReactNode;
  className?: string;
}

export function MenuSection({ 
  items, 
  title, 
  isCollapsed = false, 
  onSecondaryItemClick,
  onFocus,
  renderIcon,
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
        {items?.map((item: MenuItem) => {
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
          return (
            <MenuItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              onClick={() => onSecondaryItemClick?.(item)}
              onFocus={onFocus}
            />
          )
        })}
      </nav>
    </div>
  )
}
