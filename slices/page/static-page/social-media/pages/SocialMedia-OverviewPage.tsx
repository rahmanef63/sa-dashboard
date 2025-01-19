import React from 'react'
import { MetricsGrid } from "../components/dashboard/MetricsGrid";
import { ContentCalendar } from "../components/dashboard/ContentCalendar";
import { AnalyticsCharts } from "../components/dashboard/AnalyticsCharts";
import { AudienceInsights } from "../components/dashboard/AudienceInsights";

const SocialMediaOverviewPage: React.FC = () => {
  return (
    <>
    <MetricsGrid />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ContentCalendar />
      <AnalyticsCharts />
    </div>
    <AudienceInsights />
  </>
  )
}

export default SocialMediaOverviewPage
