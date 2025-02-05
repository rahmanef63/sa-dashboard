import React from 'react'
import { Collapsible, CollapsibleContent } from "shared/components/ui/collapsible"
import { Button } from "shared/components/ui/button"
import { Edit, Trash } from 'lucide-react'
import { MenuItem as MenuType, MenuContextType } from '@/slices/sidebar/menu/types/'
import { MenuItemContainer } from './MenuItemContainer'
import { useMenuContext } from '@/slices/sidebar/menu/context/menu-context'

interface SidebarMenuItemComponentProps {
  item: MenuType
}

export function SidebarMenuItemComponent({
  item,
}: SidebarMenuItemComponentProps) {
  const { updateMenuItem, deleteMenuItem } = useMenuContext()

  return (
    <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
      <div>
        <MenuItemContainer item={item}>
          <MenuItem item={item} />
        </MenuItemContainer>
        {item.items && item.items.length > 0 && (
          <CollapsibleContent>
            <div className="pl-4 mt-2">
              {item.items.map((subItem) => (
                <MenuItemContainer key={subItem.id} item={subItem}>
                  <MenuItem 
                    item={{ 
                      ...subItem, 
                      icon: 'chevron-right' // default icon for sub-items
                    }} 
                  />
                </MenuItemContainer>
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
