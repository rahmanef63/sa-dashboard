"use client"

import { useBreadcrumb } from "../breadcrumb-provider"
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
import React from "react"

export function BreadcrumbNav() {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
        {breadcrumbs.length > 3 ? (
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
          </>
        ) : (
          breadcrumbs.map((crumb, index, array) => (
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
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}