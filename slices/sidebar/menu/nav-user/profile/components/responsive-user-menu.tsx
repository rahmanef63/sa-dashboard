"use client"

import * as React from "react"
import { useMediaQuery } from "@/shared/hooks/use-media-query"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "shared/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "shared/components/ui/drawer"

interface ResponsiveDialogProps {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ResponsiveDialogContext = React.createContext<{ isDesktop: boolean }>({ isDesktop: true })

export function ResponsiveDialog({
  children,
  trigger,
  className,
  open,
  onOpenChange,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const Component = isDesktop ? Sheet : Drawer
  const TriggerComponent = isDesktop ? SheetTrigger : DrawerTrigger
  const ContentComponent = isDesktop ? SheetContent : DrawerContent

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop }}>
      <Component open={open} onOpenChange={onOpenChange}>
        <TriggerComponent asChild>
          {trigger}
        </TriggerComponent>
        <ContentComponent 
          side={isDesktop ? "right" : "bottom"}
          className={className}
        >
          {children}
        </ContentComponent>
      </Component>
    </ResponsiveDialogContext.Provider>
  )
}

function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext)
  const HeaderComponent = isDesktop ? SheetHeader : DrawerHeader
  return <HeaderComponent className={className}>{children}</HeaderComponent>
}

function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext)
  const TitleComponent = isDesktop ? SheetTitle : DrawerTitle
  return <TitleComponent className={className}>{children}</TitleComponent>
}

function Content({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

ResponsiveDialog.Header = Header
ResponsiveDialog.Title = Title
ResponsiveDialog.Content = Content
