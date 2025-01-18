"use client"

import { Button } from "shared/components/ui/button"
import { cn } from "shared/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MenuSection } from "../menu"
import type { MenuItemWithChildren } from "../menu/types"
import { TeamSwitcher } from "../team-switcher"
import { NavProjects } from "../nav-projects"
import { NavUser } from "../nav-user"
import { teams, projects, defaultUser } from "shared/constants/dashboard"

interface MainSidebarProps {
  items: MenuItemWithChildren[]
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onNavItemClick: (item: MenuItemWithChildren) => void
  setIsSecondaryOpen: (open: boolean) => void
}

export function MainSidebar({ items, isOpen, setIsOpen, onNavItemClick, setIsSecondaryOpen }: MainSidebarProps) {
  const handleFocus = () => {
    // When a collapsible menu in main sidebar is clicked, ensure main sidebar is open
    setIsOpen(true)
    // Close secondary sidebar when focusing on main sidebar
    setIsSecondaryOpen(false)
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out z-50 flex flex-col border-r border-border",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center p-4">
          <h2 className={cn("font-bold transition-opacity duration-200", 
            isOpen ? "opacity-100" : "opacity-0 hidden"
          )}>Navigation</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-8 h-8 p-0"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <TeamSwitcher teams={teams} />
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <MenuSection 
          items={items} 
          isCollapsed={!isOpen} 
          onSecondaryItemClick={onNavItemClick}
          onFocus={handleFocus}
          title="Navigation"
        />
        <NavProjects projects={projects} />
      </div>
      
      <div className="flex-shrink-0 border-t border-sidebar-border">
        <NavUser user={defaultUser} />
      </div>
    </aside>
  )
}