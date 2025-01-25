import type { Metadata } from 'next'
import './globals.css'
import { DebugConsole } from '@/shared/components/DebugConsole'
import { Toaster } from '@/shared/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Main Dashboard',
  description: 'general dashboard',
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
