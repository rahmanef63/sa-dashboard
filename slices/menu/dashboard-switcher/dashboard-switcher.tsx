"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Dashboard } from '@/shared/types/navigation-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { renderIcon } from "@/shared/icon-picker/utils"
import { DASHBOARD_SWITCHER_LABELS, DASHBOARD_SWITCHER_SHORTCUTS } from "./constants"
import { useDashboardSwitcher } from "./hooks/use-dashboard-switcher"

interface DashboardSwitcherProps {
  dashboards: Dashboard[]
  onDashboardChange: (dashboard: Dashboard) => void
  className?: string
  isMobile?: boolean
  defaultDashboardId?: string
}

export function DashboardSwitcher({ 
  dashboards, 
  onDashboardChange, 
  className,
  isMobile = false,
  defaultDashboardId = 'main'
}: DashboardSwitcherProps) {
  const { activeDashboard, menuItems, setActiveDashboard } = useDashboardSwitcher({
    initialDashboards: dashboards,
    onDashboardChange,
    defaultDashboardId
  })

  const [open, setOpen] = React.useState(false)

  const handleDashboardSelect = React.useCallback((dashboard: Dashboard) => {
    setActiveDashboard(dashboard)
    setOpen(false)
  }, [setActiveDashboard])

  if (!activeDashboard) return null

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {renderIcon(activeDashboard.logo)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeDashboard.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeDashboard.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {DASHBOARD_SWITCHER_LABELS.DASHBOARDS}
            </DropdownMenuLabel>
            {dashboards.map((dashboard, index) => (
              <DropdownMenuItem
                key={dashboard.dashboardId}
                onClick={() => handleDashboardSelect(dashboard)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {renderIcon(dashboard.logo)}
                </div>
                <span className="flex-1">{dashboard.name}</span>
                <DropdownMenuShortcut>{DASHBOARD_SWITCHER_SHORTCUTS.BASE}{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">{DASHBOARD_SWITCHER_LABELS.ADD_DASHBOARD}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}