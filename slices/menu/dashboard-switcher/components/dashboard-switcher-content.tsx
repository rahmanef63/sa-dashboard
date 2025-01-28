import { renderIcon } from "@/shared/icon-picker/utils"
import { Dashboard } from '@/shared/types/navigation-types'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "shared/components/ui/dropdown-menu"
import { Plus } from "lucide-react"
import { DASHBOARD_SWITCHER_LABELS, DASHBOARD_SWITCHER_SHORTCUTS } from '../constants'

interface DashboardSwitcherContentProps {
  dashboards: Dashboard[]
  onDashboardChange: (dashboard: Dashboard) => void
  isMobile: boolean
}

export function DashboardSwitcherContent({ dashboards, onDashboardChange, isMobile }: DashboardSwitcherContentProps) {
  return (
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
          onClick={() => onDashboardChange(dashboard)}
          className="gap-2 p-2"
        >
          <div className="flex size-6 items-center justify-center rounded-sm border">
            {renderIcon(dashboard.logo)}
          </div>
          {dashboard.name}
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
  )
}
