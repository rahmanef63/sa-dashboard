import React from 'react'
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "shared/components/ui/card"
import { MenuItemWithIcon } from '@/shared/components/icon-picker/types'
import { IconPicker } from '@/shared/components/icon-picker/components/IconPicker'
import { useMenuItemForm } from '../hooks'

type CustomMenuItemFormProps = {
  onAddItem: (item: MenuItemWithIcon) => void
  initialValues?: MenuItemWithIcon
  title?: string
}

export function CustomMenuItemForm({ onAddItem, initialValues, title = "Add Custom Menu Item" }: CustomMenuItemFormProps) {
  const { item, handleChange, handleSubmit } = useMenuItemForm({ 
    initialValues, 
    onSubmit: onAddItem  
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{initialValues ? 'Edit existing menu item' : 'Create a new menu item'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={item.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="icon">Icon</Label>
            <IconPicker
              value={item.icon}
              onChange={(value) => handleChange('icon', value)}
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={item.url.href}
              onChange={(e) => handleChange('url', e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {initialValues ? 'Save Changes' : 'Add Custom Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

