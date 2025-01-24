import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const FINANCE_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'finance-budget',
    title: 'Budget Overview',
    url: { href: '/finance/budget' },
    icon: 'PieChart'
  },
  {
    id: 'finance-expenses',
    title: 'Expense Tracking',
    url: { href: '/finance/expenses' },
    icon: 'DollarSign'
  },
  {
    id: 'finance-investments',
    title: 'Investment Portfolio',
    url: { href: '/finance/investments' },
    icon: 'TrendingUp'
  },
  {
    id: 'finance-bills',
    title: 'Bills & Subscriptions',
    url: { href: '/finance/bills' },
    icon: 'CreditCard'
  },
  {
    id: 'finance-goals',
    title: 'Financial Goals',
    url: { href: '/finance/goals' },
    icon: 'Target'
  },
  {
    id: 'finance-tax',
    title: 'Tax Documents',
    url: { href: '/finance/tax' },
    icon: 'FileText'
  }
];
