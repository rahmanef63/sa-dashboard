// Modification: Updating rendering and modifying interactions in the nav-user component.

"use client"

import { ChevronsUpDown, Keyboard, LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "shared/components/ui/sidebar"
import { useToast } from "@/shared/hooks/use-toast"
import { useMediaQuery } from "@/shared/hooks/use-media-query"
import { useUserMenu } from "./profile/hooks/useUserMenu"
import { USER_MENU_ITEMS } from "./profile/config/menuItems"
import { handleLogout, showKeyboardShortcuts } from "./profile/utils/userActions"
import { DynamicSheet } from "./profile/lib/DynamicSheet"
import { DynamicDrawer } from "./profile/lib/DynamicDrawer"
import { useEffect } from "react"
import { User } from 'shared/types/global'
import { navUserConfig, user as defaultUser, logout } from './config'
import { useAuth } from '@/shared/dev-tool/auth-context'

interface NavUserProps {
  user?: User
}

export function NavUser({ user = defaultUser }: NavUserProps) {
  const { toast } = useToast()
  const { isMobile, state } = useSidebar()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { login, logout: authLogout } = useAuth()
  const {
    activeMenu,
    dropdownOpen,
    handleMenuOpen,
    handleOpenChange,
    handleDropdownChange
  } = useUserMenu()

  // Close dropdown when sidebar collapses
  useEffect(() => {
    if (state === "collapsed") {
      handleDropdownChange(false)
    }
  }, [state])

  if (!user) return null

  return (
    <>
      {navUserConfig.map(({ type }) => (
        isDesktop ? (
          <DynamicSheet
            key={type}
            type={type}
            open={activeMenu === type}
            onOpenChange={handleOpenChange}
          />
        ) : (
          <DynamicDrawer
            key={type}
            type={type}
            open={activeMenu === type}
            onOpenChange={handleOpenChange}
          />
        )
      ))}
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownChange}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar ?? ""} alt={user?.name ?? "User"} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name ?? "User"}</span>
                  <span className="truncate text-xs">{user?.email ?? ""}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar ?? ""} alt={user?.name ?? "User"} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name ?? "User"}</span>
                    <span className="truncate text-xs">{user?.email ?? ""}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {USER_MENU_ITEMS.map(({ type, icon, label, shortcut }) => (
                  <DropdownMenuItem key={type} onSelect={() => handleMenuOpen(type)}>
                    {icon}
                    {label}
                    {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => showKeyboardShortcuts(toast)}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard shortcuts
                  <DropdownMenuShortcut>?</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                authLogout()
                handleLogout(logout, toast)
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}