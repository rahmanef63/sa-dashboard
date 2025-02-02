'use client'

import { ReactNode } from 'react'
import { DashboardProviders } from '@/shared/providers/dashboard-providers'
import { MenuProvider } from '@/slices/sidebar/menu/context/MenuContextStore'

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
