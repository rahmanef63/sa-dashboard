import React from 'react'
import { DashboardOverview } from './components/DashboardOverview'
import { useDashboardData } from './hooks/useDashboardData'
import { formatNumber } from './lib/dashboardUtils'
import { DASHBOARD_REFRESH_INTERVAL } from './constants'

const DashboardPage: React.FC = () => {
  const data = useDashboardData()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardOverview />
      <div className="mt-4">
        <p>Total Users: {formatNumber(data.totalUsers)}</p>
        <p>Active Projects: {formatNumber(data.activeProjects)}</p>
        <p>Revenue: ${formatNumber(data.revenue)}</p>
      </div>
      <p className="text-sm text-gray-500 mt-4">Data refreshes every {DASHBOARD_REFRESH_INTERVAL / 1000} seconds</p>
    </div>
  )
}

export default DashboardPage

