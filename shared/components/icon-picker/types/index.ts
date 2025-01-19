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

// Extend the existing MenuItem type
import { MenuItem as BaseMenuItem } from 'shared/types/navigation-types'

export interface MenuItemWithIcon extends BaseMenuItem {
  icon: string // This will store the icon name
}

