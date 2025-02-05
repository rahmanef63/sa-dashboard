import { renderIcon } from "@/shared/icon-picker/utils"
import { MenuSwitcherItem } from '@/slices/sidebar/menu/types/'
import { Button } from "shared/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface MenuSwitcherTriggerProps {
  activeMenu: MenuSwitcherItem
  className?: string
}

export function MenuSwitcherTrigger({ activeMenu, className }: MenuSwitcherTriggerProps) {
  return (
    <Button
      variant="ghost"
      role="combobox"
      aria-expanded={true}
      className={cn(
        "w-full justify-start gap-2 px-3 py-5 hover:bg-sidebar-hover",
        "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
        className
      )}
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-transform duration-200 hover:scale-105">
        {renderIcon(activeMenu.icon)}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight transition-opacity duration-200">
        <span className="truncate font-semibold hover:text-sidebar-accent-foreground">
          {activeMenu.name}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )
}
