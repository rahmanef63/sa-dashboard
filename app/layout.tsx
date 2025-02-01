'use client'

import './globals.css'
import { Toaster } from '@/shared/components/ui/toaster'
import DevTools from '@/shared/dev-tool/DevTools'
import { AuthProvider } from '@/shared/dev-tool/auth-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MenuProvider } from '@/slices/sidebar/menu/context/menu-context';

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MenuProvider>
              {children}
            </MenuProvider>
            <DevTools />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
