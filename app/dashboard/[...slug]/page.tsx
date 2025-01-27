'use client'

import { notFound, useParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "shared/components/ui/button"
import { getPageComponents, type PageKey } from '@/slices/page/dynamic-page/page';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

const pages = getPageComponents();

export default function DynamicDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const [content, setContent] = useState<string | null>(null)

  const slug = Array.isArray(params.slug) ? params.slug : [params.slug]
  const currentPage = (slug[0] || 'dashboard') as PageKey

  useEffect(() => {
    setContent(pathname)
  }, [pathname])

  const isValidRoute = (route: string): route is PageKey => {
    return route in pages
  }

  if (!isValidRoute(currentPage)) {
    notFound()
  }

  const PageComponent = pages[currentPage]

  return (
    <div className="p-4">
      <h1>Dynamic Dashboard Page</h1>
      {content ? (
        <>
          <p>{content}</p>
          <PageComponent />
        </>
      ) : (
        <LoadingSpinner />
      )}
      <div className="mt-4">
        <Button onClick={() => router.back()}>Back</Button>
      </div>
    </div>
  )
}
