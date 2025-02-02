// /slices/dashboard/switcher/dashboard-switcher.tsx
import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { cn } from 'shared/lib/utils';
import { Button } from 'shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from 'shared/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from 'shared/components/ui/sidebar';
import { Dashboard, DASHBOARD_SWITCHER_LABELS, DASHBOARD_SWITCHER_SHORTCUTS } from '../../types';
import { DashboardDialog } from '../crud/components/dashboard-dialog';
import { useDashboard } from "../../hooks/use-dashboard";
import { useDashboardSwitcher } from './use-dashboard-switcher';
import { Avatar, AvatarFallback, AvatarImage } from 'shared/components/ui/avatar';
import { useUser } from "@/shared/hooks/use-user";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Providers } from "@/slices/sidebar/menu/providers";
import { renderIcon } from "@/shared/icon-picker/utils";

interface DashboardSwitcherProps {
  dashboards?: Dashboard[];
  onDashboardChange?: (dashboard: Dashboard) => void;
  className?: string;
  isMobile?: boolean;
  defaultDashboardId?: string;
}

export function DashboardSwitcher({
  dashboards: propDashboards = [],
  onDashboardChange,
  className,
  isMobile = false,
  defaultDashboardId = 'main'
}: DashboardSwitcherProps) {
  const [selectedDashboardId, setSelectedDashboardId] = React.useState(defaultDashboardId);

  React.useEffect(() => {
    if (propDashboards.length > 0 && !selectedDashboardId) {
      const initialDashboard = propDashboards.find((d: Dashboard) => d.isDefault) || propDashboards[0];
      if (initialDashboard) {
        setSelectedDashboardId(initialDashboard.dashboardId);
        onDashboardChange?.(initialDashboard);
      }
    }
  }, [propDashboards, selectedDashboardId, onDashboardChange]);

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

interface DashboardSwitcherContentProps {
  dashboards?: Dashboard[];
  onDashboardChange?: (dashboard: Dashboard) => void;
  className?: string;
  isMobile?: boolean;
  defaultDashboardId?: string;
}

const DashboardSwitcherContent = React.memo(function DashboardSwitcherContent({
  dashboards: propDashboards,
  onDashboardChange,
  className,
  isMobile,
  defaultDashboardId,
}: DashboardSwitcherContentProps) {
  const { userId } = useUser();
  const { dashboards: apiDashboards, isLoading, error } = useDashboard();

  // Memoize dashboard processing
  const processedDashboards = React.useMemo(() => {
    if (propDashboards && propDashboards.length > 0) {
      return propDashboards;
    }
    return apiDashboards || [];
  }, [propDashboards, apiDashboards]);

  const handleDashboardChange = React.useCallback((dashboard: Dashboard) => {
    onDashboardChange?.(dashboard);
  }, [onDashboardChange]);

  const { activeDashboard, setActiveDashboard } = useDashboardSwitcher({
    initialDashboards: processedDashboards,  
    onDashboardChange: handleDashboardChange,
    defaultDashboardId,
  });

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDashboardSelect = React.useCallback((dashboard: Dashboard) => {
    console.log('[Debug] Dashboard Selected:', dashboard);
    setDropdownOpen(false);
    setActiveDashboard(dashboard);
  }, [setActiveDashboard]);

  const handleAddDashboard = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    setDialogOpen(true);
  }, []);

  if (isLoading) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn("w-full justify-between", className)}
        disabled
      >
        <Skeleton className="h-4 w-24" />
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn("w-full justify-between text-destructive", className)}
        disabled
      >
        {error}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (isLoading && (!propDashboards || propDashboards.length === 0)) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn("w-full justify-between", className)}
        disabled
      >
        <Skeleton className="h-4 w-24" />
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error && (!propDashboards || propDashboards.length === 0)) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={false}
        className={cn("w-full justify-between text-destructive", className)}
        disabled
      >
        Error loading dashboards
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (!processedDashboards || processedDashboards.length === 0) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="w-full justify-between text-muted-foreground">
                <Plus className="mr-2 h-4 w-4" />
                <span>{DASHBOARD_SWITCHER_LABELS.NEW_DASHBOARD}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {DASHBOARD_SWITCHER_LABELS.NO_DASHBOARDS}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {DASHBOARD_SWITCHER_LABELS.NEW_DASHBOARD}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeDashboard) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="w-full justify-between text-muted-foreground">
            Error Loading Dashboard
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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
            <DropdownMenuLabel>
              {DASHBOARD_SWITCHER_LABELS.NO_DASHBOARDS}
            </DropdownMenuLabel>
            {processedDashboards.map((dashboard: Dashboard, index: number) => (
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
  );
})
