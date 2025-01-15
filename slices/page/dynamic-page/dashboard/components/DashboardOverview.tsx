import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "shared/components/ui/card"

export const DashboardOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to your dashboard. Here's an overview of your key metrics.</p>
      </CardContent>
    </Card>
  )
}

