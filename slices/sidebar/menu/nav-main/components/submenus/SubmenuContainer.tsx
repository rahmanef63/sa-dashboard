import React from 'react'
import { SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "shared/components/ui/sidebar"
import { Button } from "shared/components/ui/button"
import { Edit, Trash } from 'lucide-react'
import { SubMenuItem } from 'shared/types/navigation-types'
import { useMenu } from '@/slices/sidebar/menu/context/MenuContextStore'
import Link from 'next/link'

interface SidebarMenuSubComponentProps {
  items: SubMenuItem[]
  groupId: string
  parentId: string
}

export function SidebarMenuSubComponent({
  items,
  groupId,
  parentId,
}: SidebarMenuSubComponentProps) {
  const { updateSubMenuItem, deleteSubMenuItem } = useMenu()

  return (
    <SidebarMenuSub>
      {items.map((subItem) => (
        <SidebarMenuSubItem key={subItem.id}>
          <SidebarMenuSubButton asChild>
            <Link href={subItem.url?.toString() || '#'}>
              <span>{subItem.name}</span>
            </Link>
          </SidebarMenuSubButton>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateSubMenuItem(groupId, parentId, subItem)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSubMenuItem(groupId, parentId, subItem.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
}
