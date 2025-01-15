import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "shared/components/ui/collapsible"
import { Button } from "shared/components/ui/button"
import { ChevronRight, Edit, Trash } from 'lucide-react'
import { MenuItem } from '../../types'
import { NavMenuItem } from './MenuItem'
import { useMenu } from '@/slices/menu/context/MenuContext'

interface SidebarMenuItemComponentProps {
  item: MenuItem
}

export function SidebarMenuItemComponent({
  item,
}: SidebarMenuItemComponentProps) {
  const { updateMenuItem, deleteMenuItem } = useMenu()

  return (
    <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
      <div>
        <NavMenuItem item={item} />
        {item.items && item.items.length > 0 && (
          <CollapsibleContent>
            <div className="pl-4 mt-2">
              {item.items.map((subItem) => (
                <NavMenuItem 
                  key={subItem.id} 
                  item={{ 
                    ...subItem, 
                    url: { href: subItem.url },
                    icon: 'chevron-right' // default icon for sub-items
                  }} 
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/collapsible:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateMenuItem(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMenuItem(item.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Collapsible>
  )
}
