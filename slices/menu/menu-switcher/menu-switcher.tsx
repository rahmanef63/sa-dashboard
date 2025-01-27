"use client"

import * as React from "react"
import { renderIcon } from "@/shared/icon-picker/utils"
import { MenuSwitcher as MenuSwitcherType } from '@/shared/types/navigation-types'
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

type MenuSwitcherProps = {
  menus: MenuSwitcherType[]
  onMenuChange: (menu: MenuSwitcherType) => void
  className?: string
}

export function MenuSwitcher({ menus, onMenuChange, className }: MenuSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeMenu, setActiveMenu] = React.useState(menus[0])

  const handleMenuChange = (menu: MenuSwitcherType) => {
    setActiveMenu(menu)
    onMenuChange(menu)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {renderIcon(activeMenu.icon)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeMenu.title}
                </span>
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
              Menus
            </DropdownMenuLabel>
            {menus.map((menu, index) => (
              <DropdownMenuItem
                key={menu.id}
                onClick={() => handleMenuChange(menu)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {renderIcon(menu.icon)}
                </div>
                {menu.title}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add menu</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}