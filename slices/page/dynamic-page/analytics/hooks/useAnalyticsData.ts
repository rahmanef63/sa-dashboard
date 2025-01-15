import { useState, useEffect } from 'react'
import { AnalyticsData } from '../types'

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setData({
        pageViews: 10000,
        uniqueVisitors: 5000,
        bounceRate: 35
      })
    }, 1000)
  }, [])

  return data
}

