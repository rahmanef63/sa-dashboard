'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/dev-tool/auth-context'
import Image from 'next/image'
import { motion } from 'framer-motion'
import DevTools from '@/shared/dev-tool/DevTools'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-12 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative h-32 w-32">
                <Image
                  src="/logo.svg"
                  alt="Dashboard Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Welcome to SA Dashboard
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="max-w-2xl text-xl text-gray-300"
            >
              Your centralized platform for system administration and monitoring
            </motion.p>

            {/* Login Prompt */}
            {!user && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="rounded-lg bg-white/10 p-4 text-lg text-blue-300">
                  <span className="mr-2">👉</span>
                  Click "Login as Admin" in the bottom right corner
                </div>
                <div className="text-sm text-gray-400">
                  Use the dev tools to access the dashboard
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <DevTools />
    </main>
  )
}
