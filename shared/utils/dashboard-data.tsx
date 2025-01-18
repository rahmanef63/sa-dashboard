import { navigationItems } from "../constants/dashboard"
import type { NavItem } from "../types/navigation-types"

export function getDefaultNavigationItems(): NavItem[] {
  return navigationItems
}