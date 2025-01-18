"use client"

import { MainSidebar } from "./main-sidebar"
import { SecondarySidebar } from "./secondary-sidebar"
import { TopBar } from "./top-bar"
import { useDashboardNavigation } from "shared/hooks/use-dashboard-navigation"
import { defaultNavigationItems } from "shared/utils/dashboard-data"
import { cn } from "shared/lib/utils"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const {
    isMainOpen,
    isSecondaryOpen,
    activeSubmenu,
    setIsMainOpen,
    setIsSecondaryOpen,
    handleNavItemClick,
    handleBack,
  } = useDashboardNavigation()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render navigation elements after client-side hydration
  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className={cn(
          "flex flex-col flex-1 min-h-screen"
        )}>
          <main className="flex-1 px-4 py-4">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar 
        items={defaultNavigationItems}
        isOpen={isMainOpen}
        setIsOpen={setIsMainOpen}
        onNavItemClick={handleNavItemClick}
        setIsSecondaryOpen={setIsSecondaryOpen}
      />
      
      <SecondarySidebar 
        isOpen={isSecondaryOpen}
        items={activeSubmenu}
        onBack={handleBack}
      />
      
      <div className={cn(
        "flex flex-col flex-1 min-h-screen",
        isMainOpen ? "lg:ml-64" : "lg:ml-16",
        isSecondaryOpen && "lg:ml-[20rem]"
      )}>
        <TopBar header={header} />
        <main className="flex-1 px-4 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}