'use client'

import { ReactNode } from 'react'
import { QueryProvider } from '@/shared/providers/query-provider'
import { AuthProvider } from '@/shared/dev-tool/auth-context'
import { MenuProvider } from '@/slices/sidebar/menu/nav-main/context/menu-context'

// Base providers that are needed across the entire app
export function BaseProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <MenuProvider>
          {children}
        </MenuProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
