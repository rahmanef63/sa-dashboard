import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { IconPicker } from '@/shared/icon-picker/components/IconPicker'
import { NavigationItem, NavUrl } from '@/slices/sidebar/menu/types/'

interface BaseNavigationFormProps {
  item?: NavigationItem | null
  onSave: (item: any) => void
  onCancel?: () => void
  placeholder?: {
    name?: string
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
  const [name, setName] = useState(item?.name || '')
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
        name,
        url: { 
          ...(typeof item.url === 'object' ? item.url : { target: '_self' }),
          href: url 
        },
        icon,
      })
    } else {
      onSave(createNewItem(name, url, icon, ...additionalArgs))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder.name || "Enter name"}
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
