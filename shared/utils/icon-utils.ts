import { LucideIcon } from 'lucide-react'
import { getIconByName } from '@/shared/icon-picker/utils'

interface IconProps {
  icon?: string | LucideIcon
  className?: string
}

export const resolveIcon = ({ icon, className = 'h-4 w-4' }: IconProps) => {
  if (!icon) return null
  
  if (typeof icon === 'string') {
    const IconComponent = getIconByName(icon)
    return IconComponent ? { Component: IconComponent, className } : null
  }
  
  return { Component: icon, className }
}

export const isValidIcon = (icon: any): icon is string | LucideIcon => {
  return typeof icon === 'string' || typeof icon === 'function'
}
