import React from 'react'
import { MenuItemFormProps } from 'shared/types/navigation-types'
import { createNewMenuItem } from '../../utils'
import { BaseNavigationForm } from './BaseNavigationForm'

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  return (
    <BaseNavigationForm
      item={item}
      onSave={onSave}
      onCancel={onCancel}
      placeholder={{
        title: "Enter menu item title",
        url: "Enter menu item URL"
      }}
      createNewItem={createNewMenuItem}
    />
  )
}
