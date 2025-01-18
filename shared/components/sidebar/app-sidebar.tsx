"use client"

import * as React from "react"
import { 
  Archive,
  Bell,
  Database,
  FileText,
  FolderKanban,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Lock,
  Send,
  Settings,
  Store,
  Trash,
  UserCircle,
  Users,
} from 'lucide-react'

import { NavMain } from "@/slices/menu/nav-main/nav-main"
import { NavProjects } from "@/slices/menu/nav-projects/nav-projects"
import { NavUser } from "@/slices/menu/nav-user/nav-user"
import { TeamSwitcher } from "@/slices/menu/team-switcher/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "shared/components/ui/sidebar"

import { navProjectsConfig } from "@/slices/menu/nav-projects/config"
import { teamSwitcherConfig } from "@/slices/menu/team-switcher/config"
import type { MenuItemWithChildren } from "shared/types/navigation-types"

import { MenuSection } from "./menu"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(true)
  const [isSecondaryOpen, setIsSecondaryOpen] = React.useState(false)
  const [secondaryItems, setSecondaryItems] = React.useState<MenuItemWithChildren[] | null>(null)

  // Define navigation items
  const navigationItems: MenuItemWithChildren[] = [
    {
      id: 'store',
      title: 'Menu Store',
      href: '/dashboard/menu-store',
      icon: <Store className="mr-2" />,
    },
    {
      id: 'database',
      title: 'Database Management',
      href: '/dashboard/database-manager',
      icon: <Database className="mr-2" />,
    },
    { 
      id: 'dashboard', 
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: '/dashboard'
    },
    { 
      id: 'projects', 
      title: 'Projects',
      icon: <FolderKanban className="h-4 w-4" />,
      isCollapsible: true,
      children: [
        { 
          id: 'projects-active', 
          title: 'Active Projects',
          icon: <FileText className="h-4 w-4" />,
          href: '/dashboard/projects/active'
        },
        { 
          id: 'projects-archived', 
          title: 'Archived Projects',
          icon: <FileText className="h-4 w-4" />,
          href: '/dashboard/projects/archived'
        }
      ]
    },
    { 
      id: 'team', 
      title: 'Team',
      icon: <Users className="h-4 w-4" />,
      children: [
        { 
          id: 'team-members', 
          title: 'Members',
          icon: <UserCircle className="h-4 w-4" />,
          href: '/dashboard/team/members'
        },
        { 
          id: 'team-settings', 
          title: 'Settings',
          icon: <Settings className="h-4 w-4" />,
          href: '/dashboard/team/settings'
        }
      ]
    },
    {
      id: 'mail',
      title: 'Mail',
      icon: <Inbox className="h-4 w-4" />,
      isCollapsible: true,
      children: [
        {
          id: 'mail-inbox',
          title: 'Inbox',
          icon: <Inbox className="h-4 w-4" />,
          href: '/dashboard/mail/inbox'
        },
        {
          id: 'mail-sent',
          title: 'Sent',
          icon: <Send className="h-4 w-4" />,
          href: '/dashboard/mail/sent'
        },
        {
          id: 'mail-archived',
          title: 'Archived',
          icon: <Archive className="h-4 w-4" />,
          href: '/dashboard/mail/archived'
        },
        {
          id: 'mail-trash',
          title: 'Trash',
          icon: <Trash className="h-4 w-4" />,
          href: '/dashboard/mail/trash'
        }
      ]
    },
    { 
      id: 'settings', 
      title: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      isCollapsible: true,
      children: [
        { 
          id: 'settings-profile', 
          title: 'Profile',
          icon: <UserCircle className="h-4 w-4" />,
          href: '/dashboard/settings/profile'
        },
        { 
          id: 'settings-notifications', 
          title: 'Notifications',
          icon: <Bell className="h-4 w-4" />,
          href: '/dashboard/settings/notifications'
        },
        { 
          id: 'settings-security', 
          title: 'Security',
          icon: <Lock className="h-4 w-4" />,
          href: '/dashboard/settings/security'
        },
        { 
          id: 'settings-help', 
          title: 'Help & Support',
          icon: <HelpCircle className="h-4 w-4" />,
          href: '/dashboard/settings/help'
        }
      ]
    }
  ]

  const handleNavItemClick = (item: MenuItemWithChildren) => {
    if (item.children) {
      setSecondaryItems(item.children)
      setIsSecondaryOpen(true)
    }
  }

  const handleSecondaryClose = () => {
    setIsSecondaryOpen(false)
    setSecondaryItems(null)
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="sidebar-placeholder" style={{ width: '240px' }} />
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={teamSwitcherConfig} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
          <NavProjects projects={navProjectsConfig} />
          <SidebarMenu>
            <MenuSection 
              items={navigationItems}
              isCollapsed={!isOpen}
              onSecondaryItemClick={handleNavItemClick}
              onFocus={() => setIsOpen(true)}
              title="Navigation"
            />
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {isSecondaryOpen && secondaryItems && (
        <Sidebar collapsible="icon" className="secondary-sidebar">
          <SidebarContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <li key={item.id} className="flex items-center px-2 py-1">
                  <a 
                    href={item.href} 
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenuButton onClick={handleSecondaryClose}>
              Back
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  )
}
