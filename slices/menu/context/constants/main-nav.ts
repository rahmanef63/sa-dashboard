import { MenuItemWithChildren } from 'shared/types/navigation-types';

export const MAIN_NAV_ITEMS: MenuItemWithChildren[] = [
    { 
      id: 'dashboard', 
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      url: { href: '/dashboard' }
    },
    {
      id: 'analyze',
      title: 'Analyze',
      icon: 'BarChart2',
      url: { href: '/dashboard/analyze' }
    },
    {
      id: 'store',
      title: 'Menu Store',
      url: { href: '/dashboard/menu-store' },
      icon: 'Store',
    },
    {
      id: 'database',
      title: 'Database Management',
      url: { href: '/dashboard/database-manager' },
      icon: 'Database',
    },
    {
      id: 'social-media',
      title: 'Social Media',
      icon: 'Database',
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
      children: [
        { 
          id: 'team-members', 
          title: 'Members',
          icon: 'UserCircle',
          isCollapsible: true,
          children: [
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
            }
          ]
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
  ]