'use client'

import { notFound, useParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "shared/components/ui/button"
import DashboardPage from '@/slices/page/dynamic-page/dashboard/page'
import AnalyticsPage from '@/slices/page/dynamic-page/analytics/page'
import SettingsPage from '@/slices/page/dynamic-page/settings/page'
import ProfilePage from '@/slices/page/dynamic-page/profile/page'
import ProjectsPage from '@/slices/page/dynamic-page/projects/page'
import TasksPage from '@/slices/page/dynamic-page/tasks/page'
import MessagesPage from '@/slices/page/dynamic-page/messages/page'
import CalendarPage from '@/slices/page/dynamic-page/calendar/page'

const pages = {
  dashboard: DashboardPage,
  analytics: AnalyticsPage,
  settings: SettingsPage,
  profile: ProfilePage,
  projects: ProjectsPage,
  tasks: TasksPage,
  messages: MessagesPage,
  calendar: CalendarPage,
}

export default function DynamicDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const [content, setContent] = useState<string | null>(null)

  const slug = Array.isArray(params.slug) ? params.slug : [params.slug]
  const currentPage = slug[0] || 'dashboard'

  useEffect(() => {
    const fetchContent = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setContent(`Dynamic content for ${pathname}`)
    }

    fetchContent()
  }, [pathname])

  const isValidRoute = (route: string) => {
    return route in pages
  }

  if (!isValidRoute(currentPage)) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Invalid Route</h1>
        <p className="mb-4">The requested dashboard page does not exist.</p>
        <Button onClick={() => router.push('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const PageComponent = pages[currentPage as keyof typeof pages]

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard: {slug.join(' / ')}</h1>
      <p className="mb-4">Current path: {pathname}</p>
      {content ? (
        <>
          <p>{content}</p>
          <PageComponent />
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div className="flex justify-center mt-4 mx-auto">
        <Button onClick={() => router.back()} className="mr-2">
          Go Back
        </Button>
        <Button onClick={() => router.push('/dashboard')}>
          Dashboard Home
        </Button>
      </div>
    </div>
  )
}

