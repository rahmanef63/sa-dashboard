import { renderIcon } from "@/shared/icon-picker/utils"
import { Dashboard } from '@/slices/sidebar/dashboard/types'
import { SidebarMenuButton } from "shared/components/ui/sidebar"
import { ChevronsUpDown } from "lucide-react"

interface DashboardSwitcherTriggerProps {
  activeDashboard: Dashboard
}

export function DashboardSwitcherTrigger({ activeDashboard }: DashboardSwitcherTriggerProps) {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-hover transition-colors duration-200"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-transform duration-200 hover:scale-105">
        {renderIcon(activeDashboard.logo)}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight transition-opacity duration-200">
        <span className="truncate font-semibold hover:text-sidebar-accent-foreground">
          {activeDashboard.name}
        </span>
        <span className="truncate text-xs text-muted-foreground">{activeDashboard.plan}</span>
      </div>
      <ChevronsUpDown className="ml-auto" />
    </SidebarMenuButton>
  )
}
