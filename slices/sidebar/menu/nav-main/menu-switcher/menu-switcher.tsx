"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { MenuSwitcherItem } from '@/slices/sidebar/menu/types/menu-items'
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
} from "shared/components/ui/sidebar"
import { renderIcon } from "@/shared/icon-picker/utils"

type MenuSwitcherProps = {
  items: MenuSwitcherItem[]
  onSelect: (item: MenuSwitcherItem) => void
  className?: string
  isMobile?: boolean
}

export function MenuSwitcher({ items, onSelect, className, isMobile = false }: MenuSwitcherProps) {
  const [activeItem, setActiveItem] = React.useState<MenuSwitcherItem | undefined>(items?.[0])

  if (!items?.length) {
    return null
  }

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {renderIcon(activeItem?.icon)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeItem?.name}
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
            {items.map((menu: MenuSwitcherItem, index: number) => (
              <DropdownMenuItem
                key={menu.id}
                onClick={() => {
                  setActiveItem(menu)
                  onSelect(menu)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {renderIcon(menu.icon)}
                </div>
                {menu.name}
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