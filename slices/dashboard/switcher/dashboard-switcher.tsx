import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Dashboard,
  DASHBOARD_SWITCHER_LABELS, 
  DASHBOARD_SWITCHER_SHORTCUTS,
  DashboardSwitcherProps
 } from 'slices/dashboard/types/index'
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
import { useDashboardSwitcher } from "./hooks/use-dashboard-switcher"
import { DashboardDialog } from "../crud/components/dashboard-dialog"
import { Providers } from "../../menu/providers"
import { useDashboards } from "../hooks/use-dashboards"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useUser } from "@/shared/hooks/use-user"
import { useMemo } from 'react';

export function DashboardSwitcher({ 
  dashboards: propDashboards,
  onDashboardChange, 
  className,
  isMobile = false,
  defaultDashboardId = 'main'
}: DashboardSwitcherProps) {
  return (
    <Providers>
      <DashboardSwitcherContent 
        dashboards={propDashboards}
        onDashboardChange={onDashboardChange} 
        className={className}
        isMobile={isMobile}
        defaultDashboardId={defaultDashboardId}
      />
    </Providers>
  );
}

function DashboardSwitcherContent({
  dashboards: propDashboards,
  onDashboardChange, 
  className,
  isMobile = false,
  defaultDashboardId = 'main'
}: DashboardSwitcherProps) {
  const { userId } = useUser();
  const { data: apiDashboards, isLoading } = useDashboards(userId);
  
  // Debug logging
  console.log('Dashboard Switcher State:', {
    propDashboards,
    apiDashboards,
    isLoading,
    userId
  });
  
  const dashboards = useMemo(() => {
    const finalDashboards = propDashboards.length > 0 ? propDashboards : (apiDashboards || []);
    console.log('Final Dashboards:', finalDashboards);
    return finalDashboards;
  }, [propDashboards, apiDashboards]);

  const { activeDashboard, menuItems, setActiveDashboard } = useDashboardSwitcher({
    initialDashboards: dashboards,
    onDashboardChange,
    defaultDashboardId
  })

  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleDashboardSelect = React.useCallback((dashboard: Dashboard) => {
    setActiveDashboard(dashboard)
    setDropdownOpen(false)
  }, [setActiveDashboard])

  const handleAddDashboard = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownOpen(false)
    setDialogOpen(true)
  }, [])

  if (isLoading && !propDashboards.length) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <Skeleton className="h-12 w-full" />
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!dashboards.length) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full justify-between"
              >
                <span className="text-muted-foreground">No Dashboards</span>
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{DASHBOARD_SWITCHER_LABELS.DASHBOARDS}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground">
                No dashboards available
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAddDashboard}>
                <Plus className="mr-2 h-4 w-4" />
                <span>{DASHBOARD_SWITCHER_LABELS.ADD_DASHBOARD}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeDashboard) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="w-full justify-between text-muted-foreground"
          >
            Error Loading Dashboard
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
            {dashboards.map((dashboard: Dashboard, index: number) => (
              <DropdownMenuItem
                key={dashboard.id}
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
            <DropdownMenuItem 
              className="gap-2 p-2 cursor-pointer" 
              onClick={handleAddDashboard}
              onSelect={(e) => e.preventDefault()}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                {DASHBOARD_SWITCHER_LABELS.ADD_DASHBOARD}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <DashboardDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode="create"
      />
    </SidebarMenu>
  )
}