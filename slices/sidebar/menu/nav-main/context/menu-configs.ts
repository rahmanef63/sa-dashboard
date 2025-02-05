import { MenuItem } from '@/slices/sidebar/menu/types/'
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
} from './constants/index'

// Map dashboard IDs to their respective navigation items
export const menuConfigs: Record<string, MenuItem[]> = {
  main: MAIN_NAV_ITEMS,
  home: HOME_NAV_ITEMS,
  professional: PROFESSIONAL_NAV_ITEMS,
  study: STUDY_NAV_ITEMS,
  health: HEALTH_NAV_ITEMS,
  travel: TRAVEL_NAV_ITEMS,
  family: FAMILY_NAV_ITEMS,
  finance: FINANCE_NAV_ITEMS,
  hobbies: HOBBIES_NAV_ITEMS,
  digital: DIGITAL_NAV_ITEMS,
  personal: PERSONAL_NAV_ITEMS
} as const