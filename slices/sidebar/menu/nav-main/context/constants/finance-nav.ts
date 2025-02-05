import { FinanceNavItems, MenuItem } from '@/slices/sidebar/menu/types/';

export const FINANCE_NAV_ITEMS: FinanceNavItems = [
  {
    id: 'finance-dashboard',
    title: 'Financial Overview',
    url: { href: '/finance/dashboard' },
    icon: 'PieChart',
    menuType: 'finance',
    dashboardId: 'finance-dashboard'
  },
  {
    id: 'finance-budget',
    title: 'Budget Planning',
    url: { href: '/finance/budget' },
    icon: 'Calculator',
    menuType: 'finance',
    dashboardId: 'finance-dashboard'
  },
  {
    id: 'finance-investments',
    title: 'Investments',
    url: { href: '/finance/investments' },
    icon: 'TrendingUp',
    menuType: 'finance',
    dashboardId: 'finance-dashboard'
  },
  {
    id: 'finance-expenses',
    title: 'Expenses',
    url: { href: '/finance/expenses' },
    icon: 'CreditCard',
    menuType: 'finance',
    dashboardId: 'finance-dashboard'
  },
  {
    id: 'finance-reports',
    title: 'Financial Reports',
    url: { href: '/finance/reports' },
    icon: 'FileText',
    menuType: 'finance',
    dashboardId: 'finance-dashboard'
  },
  {
    id: 'finance-goals',
    title: 'Financial Goals',
    url: { href: '/finance/goals' },
    icon: 'Target',
    menuType: 'finance',
    dashboardId: 'finance-dashboard'
  }
];
