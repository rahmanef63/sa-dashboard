import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "shared/components/ui/card"

export const AnalyticsChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Here's where we'd render a chart with analytics data.</p>
      </CardContent>
    </Card>
  )
}

