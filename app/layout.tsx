'use client'

import './globals.css'
import { DebugConsole } from '@/shared/components/DebugConsole'
import { Toaster } from '@/shared/components/ui/toaster'
import DevTools from '@/shared/dev-tool/DevTools'
import { AuthProvider } from '@/shared/dev-tool/auth-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <div id="debug-console">
              <DebugConsole />
            </div>
            <DevTools />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
