import React from 'react'
import { Button } from "shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/components/ui/card"
import { MenuItemWithIcon } from '@/shared/icon-picker/types'
import { getIconByName } from '@/shared/icon-picker/utils'

type AvailableMenuItemsProps = {
  items: MenuItemWithIcon[]
  onAddItem: (item: MenuItemWithIcon) => void
}

export function AvailableMenuItems({ items, onAddItem }: AvailableMenuItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Menu Items</CardTitle>
        <CardDescription>Click to add to your menu</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {items.map((item) => {
            const IconComponent = getIconByName(item.icon)
            return (
              <Button
                key={item.id}
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAddItem(item)}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {item.title}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
