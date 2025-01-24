import React from 'react'
import { ChevronRight } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "shared/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "shared/components/ui/collapsible"
import { GroupLabel, MenuItem } from 'shared/types/navigation-types'
import { useMenu } from '@/slices/menu/context/MenuContext'
import { NavMenuItem } from '../items/MenuItem'
import { cn } from '@/shared/lib/utils'
import { sortByOrder } from '../../utils'

interface SidebarGroupComponentProps {
  group: {
    label: GroupLabel
    items: MenuItem[]
  }
  className?: string
  onEditLabel?: (label: GroupLabel) => void
  onDeleteLabel?: (id: string) => void
  onEditItem?: (item: MenuItem) => void
  onDeleteItem?: (itemId: string) => void
}

export function SidebarGroupComponent({
  group,
  className,
  onEditLabel,
  onDeleteLabel,
  onEditItem,
  onDeleteItem
}: SidebarGroupComponentProps) {
  const { updateMenuItem, deleteMenuItem } = useMenu()
  const sortedItems = React.useMemo(() => 
    [...group.items].sort((a, b) => (a.order || 0) - (b.order || 0)), 
    [group.items]
  )

  return (
    <Collapsible defaultOpen className={cn("group/collapsible", className)}>
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <div className="relative group">
            <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50">
              <span className="truncate">{group.label.title}</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarGroupLabel>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu>
            {sortedItems.map((item) => (
              <NavMenuItem 
                key={item.id} 
                item={item}
                className="pl-2"
              />
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
