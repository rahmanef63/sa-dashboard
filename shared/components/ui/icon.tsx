import React from 'react'
import { LucideIcon } from 'lucide-react'
import { resolveIcon } from '@/shared/utils/icon-utils'
import { cn } from '@/shared/lib/utils'

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string | LucideIcon
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
}

export function Icon({ 
  icon, 
  size = 'md',
  className,
  ...props 
}: IconProps) {
  const resolvedIcon = resolveIcon({ 
    icon, 
    className: cn(sizeClasses[size], className)
  })

  if (!resolvedIcon) return null

  const { Component, className: iconClassName } = resolvedIcon

  return (
    <div {...props}>
      <Component className={iconClassName} />
    </div>
  )
}
