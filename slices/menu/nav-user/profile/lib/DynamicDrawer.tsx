"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "shared/components/ui/drawer"
import { DynamicProps } from "../components/types"
import { USER_MENU_CONTENTS, USER_MENU_TITLES } from "../config/menuItems"

export function DynamicDrawer({ type, trigger, open, onOpenChange }: DynamicProps) {
  const content = USER_MENU_CONTENTS[type]
  const title = USER_MENU_TITLES[type]
  
  if (!content) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
      )}
      <DrawerContent className="max-w-[90%] w-full sm:max-w-[540px] mx-auto">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
