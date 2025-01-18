import React from 'react'
import { SidebarGroupLabel as UISidebarGroupLabel } from "shared/components/ui/sidebar"
import { GroupLabel } from 'shared/types/navigation-types'
import { Button } from "shared/components/ui/button"
import { Edit, Trash } from 'lucide-react'

interface SidebarGroupLabelProps {
  label: GroupLabel
  onEdit: (label: GroupLabel) => void
  onDelete: (id: string) => void
  children: React.ReactNode
}

export function SidebarGroupLabel({ label, onEdit, onDelete, children }: SidebarGroupLabelProps) {
  return (
    <div className="relative group">
      <UISidebarGroupLabel>{label.title}</UISidebarGroupLabel>
      {children}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(label)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(label.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

