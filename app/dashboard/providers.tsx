'use client'

import { ReactNode } from 'react'
import { DashboardProviders } from '@/shared/providers/dashboard-providers'
import { DashboardProvider } from '@/context/dashboard-context'
import { MenuProvider } from '@/slices/sidebar/menu/nav-main/context/MenuContextStore'

// Only include dashboard-specific providers since base providers are in root layout
export function DashboardProviderGroup({ children }: { children: ReactNode }) {
  return (
    <DashboardProviders>
      <MenuProvider>
        {children}
      </MenuProvider>
    </DashboardProviders>
  )
}
