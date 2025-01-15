import { type LucideIcon } from 'lucide-react'

export type MenuItem = {
  id: string
  title: string
  url: { href: string }
  icon: string
}

export type MenuItemFormProps = {
  item: MenuItem | null
  onSave: (item: MenuItem) => void
}

