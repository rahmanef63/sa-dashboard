import { useState, useCallback, useMemo } from 'react'
import { Dashboard, UseDashboardSwitcherProps  } from 'slices/dashboard/types/'
import { MenuCategory } from 'shared/types/navigation-types'

export function useDashboardSwitcher({ 
  initialDashboards, 
  onDashboardChange,
  defaultDashboardId = 'main'
}: UseDashboardSwitcherProps) {
  // Find default dashboard or use first one
  const defaultDashboard = useMemo(() => 
    initialDashboards.find(d => d.id === defaultDashboardId) || initialDashboards[0],
    [initialDashboards, defaultDashboardId]
  )

  const [activeDashboard, setActiveDashboard] = useState<Dashboard>(defaultDashboard)

  // Get menu items for the active dashboard
  const menuItems = useMemo(() => {
    if (!activeDashboard) return []
    
    // First try to get menuList (backward compatibility)
    if (activeDashboard.menuList) {
      return activeDashboard.menuList
    }
    
    // Then try to get items from the default menu
    if (activeDashboard.menus?.length) {
      const defaultMenu = activeDashboard.menus.find(menu => menu.isDefault) || activeDashboard.menus[0]
      return defaultMenu.items
    }

    return []
  }, [activeDashboard])

  const handleDashboardChange = useCallback((dashboard: Dashboard) => {
    setActiveDashboard(dashboard)
    onDashboardChange?.(dashboard)
  }, [onDashboardChange])

  return {
    activeDashboard,
    menuItems,
    setActiveDashboard: handleDashboardChange
  }
}
