import { type Dashboard } from '@/slices/sidebar/dashboard/types'
import {
  DIGITAL_NAV_ITEMS,
  FAMILY_NAV_ITEMS,
  FINANCE_NAV_ITEMS,
  HEALTH_NAV_ITEMS,
  HOBBIES_NAV_ITEMS,
  HOME_NAV_ITEMS,
  MAIN_NAV_ITEMS,
  PERSONAL_NAV_ITEMS,
  PROFESSIONAL_NAV_ITEMS,
  STUDY_NAV_ITEMS,
  TRAVEL_NAV_ITEMS
} from '@/slices/sidebar/menu/context/constants'

export const DASHBOARDS: Dashboard[] = [
  {
    name: 'Mainan',
    logo: 'layout-dashboard',
    plan: 'Personal',
    dashboardId: 'main',
    menus: [{
      id: 'main-menu',
      name: 'Main Menu',
      menuType: 'main',
      items: MAIN_NAV_ITEMS,
      isDefault: true
    }]
  },
  {
    name: 'Home',
    logo: 'home',
    plan: 'Personal',
    dashboardId: 'home',
    menus: [{
      id: 'home-menu',
      name: 'Home Menu',
      menuType: 'home',
      items: HOME_NAV_ITEMS
    }]
  },
  {
    name: 'Professional',
    logo: 'briefcase',
    plan: 'Professional',
    dashboardId: 'professional',
    menus: [{
      id: 'professional-menu',
      name: 'Professional Menu',
      menuType: 'professional',
      items: PROFESSIONAL_NAV_ITEMS
    }]
  },
  {
    name: 'Study',
    logo: 'graduation-cap',
    plan: 'Personal',
    dashboardId: 'study',
    menus: [{
      id: 'study-menu',
      name: 'Study Menu',
      menuType: 'study',
      items: STUDY_NAV_ITEMS
    }]
  },
  {
    name: 'Health',
    logo: 'heart',
    plan: 'Personal',
    dashboardId: 'health',
    menus: [{
      id: 'health-menu',
      name: 'Health Menu',
      menuType: 'health',
      items: HEALTH_NAV_ITEMS
    }]
  },
  {
    name: 'Travel',
    logo: 'plane',
    plan: 'Personal',
    dashboardId: 'travel',
    menus: [{
      id: 'travel-menu',
      name: 'Travel Menu',
      menuType: 'travel',
      items: TRAVEL_NAV_ITEMS
    }]
  },
  {
    name: 'Family',
    logo: 'users',
    plan: 'Personal',
    dashboardId: 'family',
    menus: [{
      id: 'family-menu',
      name: 'Family Menu',
      menuType: 'family',
      items: FAMILY_NAV_ITEMS
    }]
  },
  {
    name: 'Finance',
    logo: 'wallet',
    plan: 'Professional',
    dashboardId: 'finance',
    menus: [{
      id: 'finance-menu',
      name: 'Finance Menu',
      menuType: 'finance',
      items: FINANCE_NAV_ITEMS
    }]
  },
  {
    name: 'Hobbies',
    logo: 'palette',
    plan: 'Personal',
    dashboardId: 'hobbies',
    menus: [{
      id: 'hobbies-menu',
      name: 'Hobbies Menu',
      menuType: 'hobbies',
      items: HOBBIES_NAV_ITEMS
    }]
  },
  {
    name: 'Digital',
    logo: 'monitor',
    plan: 'Personal',
    dashboardId: 'digital',
    menus: [{
      id: 'digital-menu',
      name: 'Digital Menu',
      menuType: 'digital',
      items: DIGITAL_NAV_ITEMS
    }]
  },
  {
    name: 'Personal',
    logo: 'user',
    plan: 'Personal',
    dashboardId: 'personal',
    menus: [{
      id: 'personal-menu',
      name: 'Personal Menu',
      menuType: 'personal',
      items: PERSONAL_NAV_ITEMS
    }]
  }
]
