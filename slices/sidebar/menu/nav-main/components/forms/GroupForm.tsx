import React, { useState } from 'react'
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { GroupLabelFormProps } from 'shared/types/navigation-types'
import { createNewGroupLabel } from '../../utils'

export function GroupLabelForm({ label, onSave, onCancel }: GroupLabelFormProps) {
  const [name, setName] = useState(label?.name || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (label) {
      onSave({
        ...label,
        name
      })
    } else {
      onSave(createNewGroupLabel(name))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div>
        <Label htmlFor="name">Group Label</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group label"
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" variant="default">
          {label ? 'Update' : 'Add'} Group Label
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
