import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "shared/components/ui/collapsible"
import { Button } from "shared/components/ui/button"
import { Edit, Trash } from 'lucide-react'
import { MenuItem as MenuType } from 'shared/types/navigation-types'
import { MenuItem } from './MenuItem'
import { useMenu } from '@/slices/sidebar/menu/context/MenuContextStore'

interface SidebarMenuItemComponentProps {
  item: MenuType
}

export function SidebarMenuItemComponent({
  item,
}: SidebarMenuItemComponentProps) {
  const { updateMenuItem, deleteMenuItem } = useMenu()

  return (
    <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
      <div>
        <MenuItem item={item} />
        {item.items && item.items.length > 0 && (
          <CollapsibleContent>
            <div className="pl-4 mt-2">
              {item.items.map((subItem) => (
                <MenuItem 
                  key={subItem.id} 
                  item={{ 
                    ...subItem, 
                    url: { 
                      href: subItem.url.href,
                      target: subItem.url.target || '_self',
                      rel: subItem.url.rel
                    },
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
