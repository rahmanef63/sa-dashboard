// components/sidebar/breadcrumb-provider.tsx

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "shared/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/components/ui/dropdown-menu"

type BreadcrumbContextType = {
  breadcrumbs: { href: string; label: string }[]
  setBreadcrumbs: React.Dispatch<React.SetStateAction<{ href: string; label: string }[]>>
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    // Return a default value instead of throwing during SSR
    return {
      breadcrumbs: [],
      setBreadcrumbs: () => {}
    }
  }
  return context
}

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; label: string }[]>([])
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const params = useParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const pathSegments = pathname.split('/').filter(Boolean)
      const newBreadcrumbs = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)
        return { href, label }
      })
      setBreadcrumbs(newBreadcrumbs)
    }
  }, [pathname, params, mounted])

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      <div className="breadcrumb-wrapper" suppressHydrationWarning>
        {children}
      </div>
    </BreadcrumbContext.Provider>
  )
}

export function BreadcrumbNav() {
  const { breadcrumbs } = useBreadcrumb()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="breadcrumb-nav-placeholder" suppressHydrationWarning />
  }

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLastItem = index === breadcrumbs.length - 1

          if (isLastItem) {
            return (
              <BreadcrumbItem key={breadcrumb.href}>
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          }

          if (index > 2) {
            if (index === 3) {
              return (
                <BreadcrumbItem key="ellipsis">
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
              )
            }
            return null
          }

          return (
            <BreadcrumbItem key={breadcrumb.href}>
              <BreadcrumbLink href={breadcrumb.href}>
                {breadcrumb.label}
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
