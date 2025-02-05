import React from 'react'
import { MenuItemFormProps } from '@/slices/sidebar/menu/types/'
import { createNewMenuItem } from '../../utils'
import { BaseNavigationForm } from './BaseNavigationForm'

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  return (
    <BaseNavigationForm
      item={item}
      onSave={onSave}
      onCancel={onCancel}
      placeholder={{
        name: "Enter menu item title",
        url: "Enter menu item URL"
      }}
      createNewItem={createNewMenuItem}
    />
  )
}
