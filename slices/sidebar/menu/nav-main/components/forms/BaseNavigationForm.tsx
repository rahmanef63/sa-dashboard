import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { IconPicker } from '@/shared/icon-picker/components/IconPicker'
import { NavigationItem, NavUrl } from 'shared/types/navigation-types'

interface BaseNavigationFormProps {
  item?: NavigationItem | null
  onSave: (item: any) => void
  onCancel?: () => void
  placeholder?: {
    title?: string
    url?: string
  }
  createNewItem: (title: string, url: string, icon: string, ...args: any[]) => any
  additionalArgs?: any[]
}

export function BaseNavigationForm({ 
  item, 
  onSave, 
  onCancel,
  placeholder = {},
  createNewItem,
  additionalArgs = []
}: BaseNavigationFormProps) {
  const [title, setTitle] = useState(item?.title || '')
  const [url, setUrl] = useState(
    typeof item?.url === 'string' 
      ? item.url 
      : (item?.url as NavUrl)?.href || ''
  )
  const [icon, setIcon] = useState<string>(
    typeof item?.icon === 'string' ? item.icon : 'FileText'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (item) {
      onSave({
        ...item,
        title,
        url: { 
          ...(typeof item.url === 'object' ? item.url : { target: '_self' }),
          href: url 
        },
        icon,
      })
    } else {
      onSave(createNewItem(title, url, icon, ...additionalArgs))
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
          placeholder={placeholder.title || "Enter title"}
          required
        />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder.url || "Enter URL"}
          required
        />
      </div>
      <div>
        <Label>Icon</Label>
        <IconPicker 
          value={icon} 
          onChange={setIcon}
        />
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
