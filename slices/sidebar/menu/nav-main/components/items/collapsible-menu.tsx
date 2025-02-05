import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'shared/components/ui/collapsible'
import { Button } from 'shared/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { MenuItem } from '@/slices/sidebar/menu/types'
import { MenuItemContainer } from './MenuItemContainer'
import { cn } from '@/lib/utils'

export interface CollapsibleMenuProps {
  item: MenuItem
  level?: number
  isCollapsed?: boolean
  className?: string
  onFocus?: () => void
}

export function CollapsibleMenu({ 
  item, 
  level = 0,
  isCollapsed = false,
  className,
  onFocus 
}: CollapsibleMenuProps) {
  return (
    <Collapsible
      defaultOpen={!isCollapsed}
      className={cn('space-y-2', className)}
      onFocus={onFocus}
    >
      <div className="flex items-center justify-between space-x-4">
        <MenuItemContainer item={item}>
          <div className="flex items-center space-x-2">
            {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
            <span>{item.name}</span>
          </div>
        </MenuItemContainer>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {item.children?.map((child) => (
          <MenuItemContainer key={child.id} item={child}>
            <div 
              style={{ paddingLeft: `${(level + 1) * 16}px` }}
              className="flex items-center space-x-2"
            >
              {child.icon && <span className="text-muted-foreground">{child.icon}</span>}
              <span>{child.name}</span>
            </div>
          </MenuItemContainer>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}