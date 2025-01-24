import { type LucideIcon } from 'lucide-react'

export interface IconOption {
  name: string
  icon: LucideIcon
}

export interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

// Base type for any component that uses icons
export interface WithIcon {
  icon: string // Store icon name only, will be resolved to LucideIcon via getIconByName
}

// Menu item type that includes an icon
export interface MenuItemWithIcon extends WithIcon {
  id: string
  title: string
  url: { href: string }
}

// Re-export the icon type for use throughout the app
export type { LucideIcon }
