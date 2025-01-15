import { useState, useEffect } from 'react'
import { DashboardData } from '../types'

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setData({
        totalUsers: 1000,
        activeProjects: 50,
        revenue: 100000
      })
    }, 1000)
  }, [])

  return data
}

