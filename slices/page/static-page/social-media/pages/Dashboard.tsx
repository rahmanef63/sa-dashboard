"use client";

import { Sidebar } from "../components/dashboard/Sidebar";
import { MetricsGrid } from "../components/dashboard/MetricsGrid";
import { ContentCalendar } from "../components/dashboard/ContentCalendar";
import { AnalyticsCharts } from "../components/dashboard/AnalyticsCharts";
import { AudienceInsights } from "../components/dashboard/AudienceInsights";
import { CalendarView } from "../components/calendar/CalendarView";
import { AdvancedAnalytics } from "../components/analytics/AdvancedAnalytics";
import { SettingsPanel } from "../components/settings/SettingsPanel";
import PostManagement from "./PostManagement";
import { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "calendar" | "analytics" | "settings" | "posts"
  >("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView />;
      case "analytics":
        return <AdvancedAnalytics />;
      case "settings":
        return <SettingsPanel />;
      case "posts":
        return <PostManagement />;
      default:
        return (
          <>
            <MetricsGrid />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContentCalendar />
              <AnalyticsCharts />
            </div>
            <AudienceInsights />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold mb-8">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;