import { StudyNavItems, MenuItem } from '@/slices/sidebar/menu/types/';

export const STUDY_NAV_ITEMS: StudyNavItems = [
  {
    id: 'study-overview',
    title: 'Study Overview',
    url: { href: '/study/overview' },
    icon: 'GraduationCap',
    menuType: 'study',
    dashboardId: 'study-dashboard'
  },
  {
    id: 'study-courses',
    title: 'Courses',
    url: { href: '/study/courses' },
    icon: 'BookOpen',
    menuType: 'study',
    dashboardId: 'study-dashboard',
    isCollapsible: true,
    children: [
      {
        id: 'study-courses-current',
        title: 'Current Courses',
        url: { href: '/study/courses/current' },
        icon: 'Book',
        menuType: 'study',
        dashboardId: 'study-dashboard'
      },
      {
        id: 'study-courses-completed',
        title: 'Completed Courses',
        url: { href: '/study/courses/completed' },
        icon: 'CheckSquare',
        menuType: 'study',
        dashboardId: 'study-dashboard'
      }
    ]
  },
  {
    id: 'study-assignments',
    title: 'Assignments',
    url: { href: '/study/assignments' },
    icon: 'FileText',
    menuType: 'study',
    dashboardId: 'study-dashboard'
  },
  {
    id: 'study-schedule',
    title: 'Study Schedule',
    url: { href: '/study/schedule' },
    icon: 'Calendar',
    menuType: 'study',
    dashboardId: 'study-dashboard'
  },
  {
    id: 'study-resources',
    title: 'Learning Resources',
    url: { href: '/study/resources' },
    icon: 'Library',
    menuType: 'study',
    dashboardId: 'study-dashboard'
  },
  {
    id: 'study-progress',
    title: 'Progress Tracking',
    url: { href: '/study/progress' },
    icon: 'TrendingUp',
    menuType: 'study',
    dashboardId: 'study-dashboard'
  }
];
