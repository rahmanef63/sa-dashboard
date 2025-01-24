import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const PROFESSIONAL_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'professional-work-hub',
    title: 'Work Hub',
    url: { href: '/professional/work-hub' },
    icon: 'Briefcase',
    isCollapsible: true,
    children: [
      {
        id: 'professional-company-a',
        title: 'Company A',
        url: { href: '/professional/work-hub/company-a' },
        icon: 'Building',
        isCollapsible: true,
        children: [
          {
            id: 'professional-company-a-tasks',
            title: 'Tasks & Projects',
            url: { href: '/professional/work-hub/company-a/tasks' },
            icon: 'CheckSquare'
          },
          {
            id: 'professional-company-a-communication',
            title: 'Team Communication',
            url: { href: '/professional/work-hub/company-a/communication' },
            icon: 'MessageSquare'
          },
          {
            id: 'professional-company-a-metrics',
            title: 'Performance Metrics',
            url: { href: '/professional/work-hub/company-a/metrics' },
            icon: 'TrendingUp'
          },
          {
            id: 'professional-company-a-resources',
            title: 'Company Resources',
            url: { href: '/professional/work-hub/company-a/resources' },
            icon: 'Database'
          },
          {
            id: 'professional-company-a-time',
            title: 'Time Tracking',
            url: { href: '/professional/work-hub/company-a/time' },
            icon: 'Clock'
          }
        ]
      },
      {
        id: 'professional-freelance',
        title: 'Freelance Projects',
        url: { href: '/professional/work-hub/freelance' },
        icon: 'Laptop',
        isCollapsible: true,
        children: [
          {
            id: 'professional-freelance-clients',
            title: 'Client Management',
            url: { href: '/professional/work-hub/freelance/clients' },
            icon: 'Users'
          },
          {
            id: 'professional-freelance-projects',
            title: 'Project Tracking',
            url: { href: '/professional/work-hub/freelance/projects' },
            icon: 'Trello'
          },
          {
            id: 'professional-freelance-invoicing',
            title: 'Invoicing',
            url: { href: '/professional/work-hub/freelance/invoicing' },
            icon: 'FileText'
          }
        ]
      }
    ]
  },
  {
    id: 'professional-career',
    title: 'Career Development',
    url: { href: '/professional/career' },
    icon: 'TrendingUp',
    isCollapsible: true,
    children: [
      {
        id: 'professional-career-skills',
        title: 'Skills Training',
        url: { href: '/professional/career/skills' },
        icon: 'Book'
      },
      {
        id: 'professional-career-certifications',
        title: 'Certifications',
        url: { href: '/professional/career/certifications' },
        icon: 'Award'
      },
      {
        id: 'professional-career-network',
        title: 'Professional Network',
        url: { href: '/professional/career/network' },
        icon: 'Users'
      },
      {
        id: 'professional-career-goals',
        title: 'Career Goals',
        url: { href: '/professional/career/goals' },
        icon: 'Target'
      }
    ]
  }
];
