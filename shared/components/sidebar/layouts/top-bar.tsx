"use client"

import { BreadcrumbNav } from "./breadcrumb-nav"

interface TopBarProps {
  header?: React.ReactNode
}

export function TopBar({ header }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center w-full px-4">
        <div className="flex items-center justify-between w-full">
          <BreadcrumbNav />
          {header}
        </div>
      </div>
    </header>
  )
}