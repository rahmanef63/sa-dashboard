import type { Metadata } from 'next'
import '../globals.css'
import { Toaster } from '@/shared/components/ui/toaster'
import { DashboardProviderGroup } from './providers'

export const metadata: Metadata = {
  title: 'Main Dashboard',
  description: 'general dashboard',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Wrap dashboard content with the combined provider group
    <DashboardProviderGroup>
      <div className="dashboard-layout">
        {children}
        <Toaster />
      </div>
    </DashboardProviderGroup>
  )
}
