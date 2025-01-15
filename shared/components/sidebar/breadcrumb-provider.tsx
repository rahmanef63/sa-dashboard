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
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; label: string }[]>([])
  const pathname = usePathname()
  const params = useParams()

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const newBreadcrumbs = pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      return { href, label }
    })
    setBreadcrumbs(newBreadcrumbs)
  }, [pathname, params])

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function BreadcrumbNav() {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbs.length > 3 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {breadcrumbs.slice(1, -2).map((crumb) => (
                    <DropdownMenuItem key={crumb.href}>
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {breadcrumbs.slice(-2).map((crumb, index, array) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {index === array.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < array.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

