import { MainNavItems, MenuItemWithChildren, MenuSwitcher, MenuSwitcherItem } from 'shared/types/navigation-types';

const menuItems: MenuSwitcherItem[] = [
  {
    id: 'menuA',
    title: 'Menu A',
    icon: 'LayoutDashboard',
    dashboardId: 'main-dashboard',
    menuType: 'main',
    menuList: [
      {
        id: 'listmenuA1',
        title: 'List Menu A1',
        icon: 'FileText',
        isCollapsible: true,
        children: [
          {
            id: 'listmenuA11',
            title: 'List Menu A11',
            icon: 'File',
            url: { href: '/main' }
          },
          {
            id: 'listmenuA12',
            title: 'List Menu A12',
            icon: 'File',
            url: { href: '/switcher' }
          }
        ]
      },
      {
        id: 'listmenuA2',
        title: 'List Menu A2',
        icon: 'FileText',
        url: { href: '/switcher' }
      }
    ]
  },
  {
    id: 'menuB',
    title: 'Menu B',
    icon: 'LayoutDashboard',
    dashboardId: 'main-dashboard',
    menuType: 'main',
    menuList: [
      {
        id: 'listmenuB1',
        title: 'List Menu B1',
        icon: 'FileText',
        url: { href: '/main' }
      },
      {
        id: 'listmenuB2',
        title: 'List Menu B2',
        icon: 'FileText',
        url: { href: '/switcher' }
      }
    ]
  }
];

export const MAIN_NAV_ITEMS: MainNavItems[] = [
  {
    id: 'menuSwitcher',
    title: 'MenuSwitcher',
    icon: 'LayoutDashboard',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    menus: menuItems
  } as MenuSwitcher,
  { 
    id: 'dashboard', 
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    url: { href: '/dashboard' }
  },
  {
    id: 'analyze',
    title: 'Analyze',
    icon: 'BarChart2',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    url: { href: '/dashboard/analyze' }
  },
  {
    id: 'store',
    title: 'Menu Store',
    url: { href: '/dashboard/menu-store' },
    icon: 'Store',
    menuType: 'main',
    dashboardId: 'main-dashboard'
  },
  {
    id: 'database',
    title: 'Database Management',
    url: { href: '/dashboard/database-manager' },
    icon: 'Database',
    menuType: 'main',
    dashboardId: 'main-dashboard'
  },
  {
    id: 'social-media',
    title: 'Social Media',
    icon: 'Database',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    isCollapsible: true,
    children: [
      {
        id: 'overview',
        title: 'Overview',
        icon: 'LayoutDashboard',
        url: { href: '/dashboard/social-media/overview' }
      },
      {
        id: 'posts',
        title: 'Posts',
        icon: 'Inbox',
        url: { href: '/dashboard/social-media/posts' }
      },
      {
        id: 'calendar',
        title: 'Calendar',
        icon: 'Calendar',
        url: { href: '/dashboard/social-media/calendar'}
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: 'BarChart',
        url: { href: '/dashboard/social-media/analytics'}
      },
      {
        id: 'archived',
        title: 'Archived',
        icon: 'Archive',
        url: { href: '/dashboard/social-media/archived'}
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: 'Settings',
        url: { href: '/dashboard/social-media/settings'}
      }
    ]
  },
  { 
    id: 'projects', 
    title: 'Projects',
    icon: 'FolderKanban',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    isCollapsible: true,
    children: [
      { 
        id: 'projects-active', 
        title: 'Active Projects',
        icon: 'FileText',
        url: { href: '/dashboard/projects/active'}
      },
      { 
        id: 'projects-archived', 
        title: 'Archived Projects',
        icon: 'FileText',
        url: { href: '/dashboard/projects/archived'}
      }
    ]
  },
  { 
    id: 'team', 
    title: 'Team',
    icon: 'Users',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    isCollapsible: true,
    children: [
      { 
      id: 'team-members', 
      title: 'Members',
      icon: 'UserCircle',
      url: { href: '/dashboard/team/members'}
      },
      { 
        id: 'team-members-active', 
        title: 'Active Members',
        icon: 'UserCircle',
        url: { href: '/dashboard/team/members/active'}
      },
      { 
        id: 'team-members-inactive', 
        title: 'Inactive Members',
        icon: 'UserCircle',
        url: { href: '/dashboard/team/members/inactive'}
      },
      { 
        id: 'team-settings', 
        title: 'Settings',
        icon: 'Settings',
        url: { href: '/dashboard/team/settings'}
      }
    ]
  },
  {
    id: 'mail',
    title: 'Mail',
    icon: 'Inbox',
    menuType: 'main',
    dashboardId: 'main-dashboard',
    isCollapsible: true,
    children: [
      {
        id: 'mail-inbox',
        title: 'Inbox',
        icon: 'Inbox',
        url: { href: '/dashboard/mail/inbox' }
      },
      {
        id: 'mail-sent',
        title: 'Sent',
        icon: 'Send',
        url: { href: '/dashboard/mail/sent'}
      },
      {
        id: 'mail-archived',
        title: 'Archived',
        icon: 'Archive',
        url: { href: '/dashboard/mail/archived'}
      },
      {
        id: 'mail-trash',
        title: 'Trash',
        icon: 'Trash',
        url: { href: '/dashboard/mail/trash'}
      }
    ]
  }
];