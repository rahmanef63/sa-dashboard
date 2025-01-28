import { renderIcon } from "@/shared/icon-picker/utils"
import { MenuSwitcherItem } from '@/shared/types/navigation-types'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "shared/components/ui/dropdown-menu"
import { Plus } from "lucide-react"
import { MENU_SWITCHER_LABELS, MENU_SWITCHER_SHORTCUTS } from '../constants'
import { cn } from "@/shared/lib/utils"

interface MenuSwitcherContentProps {
  menus: MenuSwitcherItem[]
  onMenuChange: (menu: MenuSwitcherItem) => void
  isMobile: boolean
  className?: string
}

export function MenuSwitcherContent({ menus, onMenuChange, isMobile, className }: MenuSwitcherContentProps) {
  return (
    <DropdownMenuContent
      className={cn(
        "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",
        className
      )}
      align="start"
      side={isMobile ? "bottom" : "right"}
      sideOffset={4}
      alignOffset={-4}
    >
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        {MENU_SWITCHER_LABELS.MENUS}
      </DropdownMenuLabel>
      {menus.map((menu, index) => (
        <DropdownMenuItem
          key={menu.id}
          onClick={() => onMenuChange(menu)}
          className="gap-2 p-2"
        >
          <div className="flex size-6 items-center justify-center rounded-sm border">
            {renderIcon(menu.icon)}
          </div>
          {menu.title}
          <DropdownMenuShortcut>{MENU_SWITCHER_SHORTCUTS.BASE}{index + 1}</DropdownMenuShortcut>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
          <Plus className="size-4" />
        </div>
        <div className="font-medium text-muted-foreground">{MENU_SWITCHER_LABELS.ADD_MENU}</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
