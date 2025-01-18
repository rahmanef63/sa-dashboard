import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { SubMenuItemFormProps } from 'shared/types/navigation-types'
import { createNewSubMenuItem } from '../../utils'

export function SubMenuItemForm({ 
  item, 
  parentId, 
  onSave, 
  onCancel 
}: SubMenuItemFormProps) {
  const [title, setTitle] = useState(item?.title || '')
  const [url, setUrl] = useState(item?.url.href || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (item) {
      onSave({
        ...item,
        title,
        url: {
          href: url,
          target: '_self'
        }
      })
    } else {
      onSave(createNewSubMenuItem(title, url, parentId))
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
          placeholder="Enter submenu item title"
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
      <div className="flex gap-2 justify-end">
        <Button type="submit" variant="default">
          {item ? 'Update' : 'Add'} Sub-Menu Item
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
