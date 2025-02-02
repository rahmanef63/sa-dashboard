'use client'

import './globals.css'
import { Toaster } from '@/shared/components/ui/toaster'
import DevTools from '@/shared/dev-tool/DevTools'
import { BaseProviders } from '@/shared/providers/base-providers'

// Root layout handles global styles and DevTools
// DevTools needs its own providers since it uses auth hooks
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background font-sans antialiased">
        <BaseProviders>
          {children}
          <DevTools />
          <Toaster />
        </BaseProviders>
      </body>
    </html>
  )
}
