import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { IconPicker } from '@/shared/components/icon-picker/components/IconPicker'
import { MenuItemFormProps } from '../../types'
import { createNewMenuItem } from '../../utils'

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const [title, setTitle] = useState(item?.title || '')
  const [url, setUrl] = useState(item?.url.href || '')
  const [icon, setIcon] = useState(item?.icon || 'FileText')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (item) {
      onSave({
        ...item,
        title,
        url: { 
          ...item.url,
          href: url 
        },
        icon,
      })
    } else {
      onSave(createNewMenuItem(title, url, icon))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter menu item title"
          required
        />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL path"
          required
        />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <IconPicker
          value={icon}
          onChange={setIcon}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" variant="default">
          {item ? 'Update' : 'Add'} Menu Item
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
