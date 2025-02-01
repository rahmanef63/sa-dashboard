"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "shared/components/ui/sheet"
import { DynamicProps } from "../components/types"
import { USER_MENU_CONTENTS, USER_MENU_TITLES } from "../config/menuItems"

export function DynamicSheet({ type, trigger, open, onOpenChange }: DynamicProps) {
  const content = USER_MENU_CONTENTS[type]
  const title = USER_MENU_TITLES[type]
  
  if (!content) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="p-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  )
}
