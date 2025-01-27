"use client"

import * as React from "react"
import { renderIcon } from "@/shared/icon-picker/utils"
import { Dashboard } from 'shared/types/navigation-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "shared/components/ui/sidebar"
import { ChevronsUpDown, Plus } from "lucide-react"

type DashboardSwitcherProps = {
  dashboards: Dashboard[]
  onDashboardChange: (dashboard: Dashboard) => void
}

export function DashboardSwitcher({ dashboards, onDashboardChange }: DashboardSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeDashboard, setActiveDashboard] = React.useState(dashboards[0])

  const handleDashboardChange = (dashboard: Dashboard) => {
    setActiveDashboard(dashboard)
    onDashboardChange(dashboard)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-4"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {renderIcon(activeDashboard.logo)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeDashboard.name}
                </span>
                <span className="truncate text-xs">{activeDashboard.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Dashboards
            </DropdownMenuLabel>
            {dashboards.map((dashboard, index) => (
              <DropdownMenuItem
                key={dashboard.name}
                onClick={() => handleDashboardChange(dashboard)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {renderIcon(dashboard.logo)}
                </div>
                {dashboard.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add dashboard</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}