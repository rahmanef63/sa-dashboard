"use client"

import { Button } from "shared/components/ui/button"
import { cn } from "shared/lib/utils"
import { ChevronLeft, X } from "lucide-react"
import { MenuSection } from "../menu"
import type { MenuItemWithChildren } from "../menu/types"

interface SecondarySidebarProps {
  items: MenuItemWithChildren[] | null
  isOpen: boolean
  onBack: () => void
}

export function SecondarySidebar({ isOpen, items, onBack }: SecondarySidebarProps) {
  if (!items) return null

  // Mark all items as collapsible for the secondary sidebar
  const collapsibleItems = items.map(item => ({
    ...item,
    isCollapsible: item.children ? true : false
  }))

  const handleFocus = () => {
    // When a collapsible menu in secondary sidebar is clicked, ensure it stays open
    // No need to do anything as the secondary sidebar is already focused
  }

  return (
    <aside className={cn(
      "fixed left-16 top-0 h-screen bg-sidebar/95 text-sidebar-foreground transition-all duration-300 ease-in-out border-l border-sidebar-border shadow-lg z-40",
      isOpen ? "w-64 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0"
    )}>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-8 h-8 p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-bold">Details</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-8 h-8 p-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <MenuSection 
        items={collapsibleItems}
        isCollapsed={false}
        onFocus={handleFocus}
      />
    </aside>
  )
}