import * as Icons from "lucide-react"
import { LucideIcon } from 'lucide-react'

export function getIconComponent(iconName: string): LucideIcon {
  return (Icons[iconName as keyof typeof Icons] || Icons.HelpCircle) as LucideIcon
}
