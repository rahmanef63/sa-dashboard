import { useState, useCallback } from 'react'
import { Dashboard } from '@/shared/types/navigation-types'

export function useDashboardSwitcher(initialDashboards: Dashboard[]) {
  const [activeDashboard, setActiveDashboard] = useState(initialDashboards[0])

  const handleDashboardChange = useCallback((dashboard: Dashboard) => {
    setActiveDashboard(dashboard)
  }, [])

  return {
    activeDashboard,
    setActiveDashboard,
    handleDashboardChange,
  }
}
