"use client"

import * as React from "react"
import Link from "next/link"
import { Database, Store } from 'lucide-react'

import { NavMain } from "@/slices/menu/nav-main/nav-main"
import { NavProjects } from "@/slices/menu/nav-projects/nav-projects"
import { NavUser } from "@/slices/menu/nav-user/nav-user"
import { TeamSwitcher } from "@/slices/menu/team-switcher/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "shared/components/ui/sidebar"

import { navProjectsConfig } from "@/slices/menu/nav-projects/config"
import { navUserConfig, user } from "@/slices/menu/nav-user/config"
import { teamSwitcherConfig } from "@/slices/menu/team-switcher/config"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamSwitcherConfig} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects projects={navProjectsConfig} />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/menu-store">
                <Store className="mr-2" />
                <span>Menu Store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/database-manager">
                <Database className="mr-2" />
                <span>Database Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
