import type { Metadata } from 'next'
import '../globals.css'
import { DashboardProviders } from '@/shared/providers/dashboard-providers'
import { Toaster } from '@/shared/components/ui/toaster'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <DashboardProviders>
        {children}
      </DashboardProviders>
      <Toaster />
    </>
  )
}
