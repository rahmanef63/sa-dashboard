import { ProfessionalNavItems, MenuItemWithChildren } from '@/shared/types/navigation-types';

export const PROFESSIONAL_NAV_ITEMS: ProfessionalNavItems = [
  {
    id: 'professional-overview',
    title: 'Career Overview',
    url: { href: '/professional/overview' },
    icon: 'Briefcase',
    menuType: 'professional',
    dashboardId: 'professional-dashboard'
  },
  {
    id: 'professional-projects',
    title: 'Projects',
    url: { href: '/professional/projects' },
    icon: 'FolderKanban',
    menuType: 'professional',
    dashboardId: 'professional-dashboard',
    isCollapsible: true,
    children: [
      {
        id: 'professional-projects-active',
        title: 'Active Projects',
        url: { href: '/professional/projects/active' },
        icon: 'Play',
        menuType: 'professional',
        dashboardId: 'professional-dashboard'
      },
      {
        id: 'professional-projects-completed',
        title: 'Completed Projects',
        url: { href: '/professional/projects/completed' },
        icon: 'CheckCircle',
        menuType: 'professional',
        dashboardId: 'professional-dashboard'
      }
    ]
  },
  {
    id: 'professional-skills',
    title: 'Skills & Certifications',
    url: { href: '/professional/skills' },
    icon: 'Award',
    menuType: 'professional',
    dashboardId: 'professional-dashboard'
  },
  {
    id: 'professional-network',
    title: 'Professional Network',
    url: { href: '/professional/network' },
    icon: 'Users',
    menuType: 'professional',
    dashboardId: 'professional-dashboard'
  },
  {
    id: 'professional-resume',
    title: 'Resume Builder',
    url: { href: '/professional/resume' },
    icon: 'FileText',
    menuType: 'professional',
    dashboardId: 'professional-dashboard'
  },
  {
    id: 'professional-goals',
    title: 'Career Goals',
    url: { href: '/professional/goals' },
    icon: 'Target',
    menuType: 'professional',
    dashboardId: 'professional-dashboard'
  }
];
