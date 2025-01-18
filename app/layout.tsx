import type { Metadata } from 'next'
import './globals.css'
import { DebugConsole } from '@/shared/components/DebugConsole'
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
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
        <div id="debug-console">
          <DebugConsole />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
