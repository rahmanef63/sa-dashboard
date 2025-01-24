import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const STUDY_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'study-courses',
    title: 'Course Tracking',
    url: { href: '/study/courses' },
    icon: 'BookOpen'
  },
  {
    id: 'study-schedule',
    title: 'Study Schedule',
    url: { href: '/study/schedule' },
    icon: 'Calendar'
  },
  {
    id: 'study-materials',
    title: 'Learning Materials',
    url: { href: '/study/materials' },
    icon: 'FileText'
  },
  {
    id: 'study-progress',
    title: 'Progress Reports',
    url: { href: '/study/progress' },
    icon: 'BarChart2'
  },
  {
    id: 'study-goals',
    title: 'Educational Goals',
    url: { href: '/study/goals' },
    icon: 'Target'
  },
  {
    id: 'study-research',
    title: 'Research Projects',
    url: { href: '/study/research' },
    icon: 'Search'
  },
  {
    id: 'study-goals-setting',
    title: 'Goal Setting',
    url: { href: '/study/goals' },
    icon: 'Flag'
  },
  {
    id: 'study-habits',
    title: 'Habit Tracking',
    url: { href: '/study/habits' },
    icon: 'CheckCircle'
  },
  {
    id: 'study-journal',
    title: 'Journal',
    url: { href: '/study/journal' },
    icon: 'Book'
  },
  {
    id: 'study-reading',
    title: 'Reading List',
    url: { href: '/study/reading' },
    icon: 'BookOpen'
  },
  {
    id: 'study-skills',
    title: 'Skill Development',
    url: { href: '/study/skills' },
    icon: 'Award'
  },
  {
    id: 'study-projects',
    title: 'Personal Projects',
    url: { href: '/study/projects' },
    icon: 'FolderPlus'
  }
];
