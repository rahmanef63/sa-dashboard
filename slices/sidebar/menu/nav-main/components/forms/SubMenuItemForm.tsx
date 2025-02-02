import React from 'react'
import { SubMenuItemFormProps } from 'shared/types/navigation-types'
import { createNewSubMenuItem } from '../../utils'
import { BaseNavigationForm } from './BaseNavigationForm'

export function SubMenuItemForm({ 
  item, 
  parentId, 
  onSave, 
  onCancel 
}: SubMenuItemFormProps) {
  return (
    <BaseNavigationForm
      item={item}
      onSave={onSave}
      onCancel={onCancel}
      placeholder={{
        name: "Enter submenu item title",
        url: "Enter submenu item URL"
      }}
      createNewItem={createNewSubMenuItem}
      additionalArgs={[parentId]}
    />
  )
}
