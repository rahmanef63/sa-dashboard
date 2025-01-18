import React from 'react'
import { Button } from "shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/components/ui/card"
import { MenuItem } from 'shared/types/navigation-types'
import { getIconComponent } from '../utils/iconUtils'
import { type ElementType } from 'react'
import { type LucideProps } from 'lucide-react'

type AvailableMenuItemsProps = {
  items: MenuItem[]
  onAddItem: (item: MenuItem) => void
}

export function AvailableMenuItems({ items, onAddItem }: AvailableMenuItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Menu Items</CardTitle>
        <CardDescription>Click to add to your menu</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={`available-${item.id}`} className="flex items-center justify-between">
              <span className="flex items-center">
                {React.createElement(
                  typeof item.icon === 'string' 
                    ? getIconComponent(item.icon) 
                    : item.icon as ElementType<LucideProps>, 
                  { className: "mr-2" }
                )}
                {item.title}
              </span>
              <Button onClick={() => onAddItem(item)}>Add</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
