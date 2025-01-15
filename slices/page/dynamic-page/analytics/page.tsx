import React from 'react'
import { AnalyticsChart } from './components/AnalyticsChart'
import { useAnalyticsData } from './hooks/useAnalyticsData'
import { calculateGrowth } from './lib/analyticsUtils'
import { ANALYTICS_DATE_RANGE } from './constants'

const AnalyticsPage: React.FC = () => {
  const data = useAnalyticsData()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <AnalyticsChart />
      <div className="mt-4">
        <p>Page Views: {data.pageViews}</p>
        <p>Unique Visitors: {data.uniqueVisitors}</p>
        <p>Bounce Rate: {data.bounceRate}%</p>
        <p>Growth: {calculateGrowth(data.pageViews, 9000)}</p>
      </div>
      <p className="text-sm text-gray-500 mt-4">Data shown for the last {ANALYTICS_DATE_RANGE} days</p>
    </div>
  )
}

export default AnalyticsPage

