import { DivideIcon as LucideIcon } from "lucide-react"

// Base menu item interface
export interface BaseMenuItem {
  id: string
  title: string
  icon?: React.ReactNode
  href?: string
}

// Menu item that can have children
export interface MenuItemWithChildren extends BaseMenuItem {
  children?: BaseMenuItem[]
  isCollapsible?: boolean
}

// Props for menu items
export interface MenuItemProps {
  item: MenuItemWithChildren
  isCollapsed?: boolean
  className?: string
}

// Props for collapsible menu
export interface CollapsibleMenuProps extends MenuItemProps {
  onFocus?: () => void
}

// Props for secondary menu
export interface SecondaryMenuProps extends MenuItemProps {
  onItemClick: (item: MenuItemWithChildren) => void
}

// Props for menu section
export interface MenuSectionProps {
  items: MenuItemWithChildren[]
  title?: string
  isCollapsed?: boolean
  onSecondaryItemClick?: (item: MenuItemWithChildren) => void
  onFocus?: () => void
  className?: string
}

// Menu display configuration
export interface MenuDisplayConfig {
  isCollapsed: boolean
  isSecondary: boolean
  showTitle: boolean
  showIcon: boolean
  showChevron: boolean
}

// Menu state configuration
export interface MenuStateConfig {
  isExpanded: boolean
  isActive: boolean
  isHovered: boolean
}

// Menu theme configuration
export interface MenuThemeConfig {
  baseClasses: string
  activeClasses: string
  hoverClasses: string
  iconClasses: string
  textClasses: string
  chevronClasses: string
}

// Menu event handlers
export interface MenuEventHandlers {
  onClick?: () => void
  onFocus?: () => void
  onHover?: () => void
  onLeave?: () => void
}

// Combined menu configuration
export interface MenuConfig {
  display: MenuDisplayConfig
  state: MenuStateConfig
  theme: MenuThemeConfig
  events: MenuEventHandlers
}

// Helper function to create default menu configuration
export const createDefaultMenuConfig = (
  isCollapsed = false,
  isSecondary = false
): MenuConfig => ({
  display: {
    isCollapsed,
    isSecondary,
    showTitle: !isCollapsed,
    showIcon: true,
    showChevron: !isCollapsed
  },
  state: {
    isExpanded: false,
    isActive: false,
    isHovered: false
  },
  theme: {
    baseClasses: "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
    activeClasses: "bg-sidebar-accent text-sidebar-accent-foreground",
    hoverClasses: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    iconClasses: "h-5 w-5",
    textClasses: "ml-2",
    chevronClasses: "transition-transform duration-200"
  },
  events: {}
})

// Helper function to merge menu configurations
export const mergeMenuConfigs = (
  baseConfig: MenuConfig,
  overrides: Partial<MenuConfig>
): MenuConfig => ({
  display: { ...baseConfig.display, ...overrides.display },
  state: { ...baseConfig.state, ...overrides.state },
  theme: { ...baseConfig.theme, ...overrides.theme },
  events: { ...baseConfig.events, ...overrides.events }
})