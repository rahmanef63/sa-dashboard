import { TypeIcon as type, LucideIcon } from 'lucide-react'

export type SubMenuItem = {
  id: string
  title: string
  url: string
}

export type MenuItem = {
  id: string
  title: string
  url: {
    href: string
    target?: string
    rel?: string
  }
  icon: string
  isActive?: boolean
  items?: SubMenuItem[]
  groupId?: string
}

export type GroupLabel = {
  id: string
  title: string
}

export type NavMainData = {
  groups: {
    label: GroupLabel
    items: MenuItem[]
  }[]
}

export type User = {
  name: string
  email: string
  avatar: string
}

export type Team = {
  name: string
  logo: LucideIcon
  plan: string
}

export type MenuItemFormProps = {
  item: MenuItem | null
  onSave: (item: MenuItem) => void
}

export type GroupLabelFormProps = {
  label: GroupLabel | null
  onSave: (label: GroupLabel) => void
}

export type SubMenuItemFormProps = {
  item: SubMenuItem | null
  onSave: (item: SubMenuItem) => void
}
