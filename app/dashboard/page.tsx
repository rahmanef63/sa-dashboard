'use client'

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "shared/components/ui/button"
import { useAuth } from "@/shared/dev-tool/auth-context"

export default function DashboardPage() {
  // STEP 1: Get auth state
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // STEP 2: Redirect if not authenticated
  useEffect(() => {
    // Only redirect if we're sure there's no user
    if (!isLoading && !user) {
      console.log('[DashboardPage] No user found, redirecting to login');
      router.push('/');
    }
  }, [user, isLoading, router]);

  // STEP 3: Show loading state
  // IMPORTANT: Must return loading state before any other hooks
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // STEP 4: Protect the page
  // IMPORTANT: Must return null before any dashboard-specific hooks
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // STEP 5: Render dashboard
  // Only reached if user is authenticated
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.name}
      </h1>
      <div className="flex space-x-4">
        <Link href="/dashboard/analytics">
          <Button>Analytics</Button>
        </Link>
        <Link href="/dashboard/database-manager">
          <Button>Database Management</Button>
        </Link>
      </div>
    </div>
  )
}
