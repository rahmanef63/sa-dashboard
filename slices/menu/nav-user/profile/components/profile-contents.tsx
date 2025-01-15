"use client"

import { ReactNode } from "react"
import { useMediaQuery } from "@/shared/hooks/use-media-query"
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "shared/components/ui/sheet"
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "shared/components/ui/drawer"

interface ProfileContentProps {
  children: ReactNode
  title: string
  description?: string
}

export function DialogContent({ children, title, description }: ProfileContentProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  const Container = isDesktop ? Sheet : Drawer
  const Header = isDesktop ? SheetHeader : DrawerHeader
  const Title = isDesktop ? SheetTitle : DrawerTitle
  const Description = isDesktop ? SheetDescription : DrawerDescription

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        {description && (
          <Description>{description}</Description>
        )}
      </Header>
      <div className="space-y-4 py-4 pb-8">
        {children}
      </div>
    </Container>
  )
}
