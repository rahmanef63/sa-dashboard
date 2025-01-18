import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";
import { analyticsData } from "./analyticsData";
import { SocialMediaLineChart } from "./LineChart/SocialMediaLineChart";
import { PlatformBarChart } from "./BarChart/PlatformBarChart";

interface AnalyticsChartsProps {
  selectedPlatform: string;
}

export const AnalyticsCharts = ({ selectedPlatform }: AnalyticsChartsProps) => {
  const filteredData = analyticsData.filter(
    (data) => data.platform === selectedPlatform
  );

  return (
    <Tabs defaultValue="reach" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="reach">Reach</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="navigation">Navigation</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="reach">
        <div className="space-y-6">
          <SocialMediaLineChart
            data={analyticsData}
            title="Overall Reach Comparison"
            dataKeys={["reach.total"]}
          />
          <PlatformBarChart
            data={filteredData}
            title="Platform Reach Breakdown"
            dataKeys={["reach.total", "reach.followers", "reach.nonFollowers"]}
            selectedPlatform={selectedPlatform}
          />
        </div>
      </TabsContent>

      <TabsContent value="engagement">
        <div className="space-y-6">
          <SocialMediaLineChart
            data={analyticsData}
            title="Overall Engagement Comparison"
            dataKeys={["engagement.total"]}
          />
          <PlatformBarChart
            data={filteredData}
            title="Platform Engagement Breakdown"
            dataKeys={[
              "engagement.total",
              "engagement.followers",
              "engagement.nonFollowers",
            ]}
            selectedPlatform={selectedPlatform}
          />
        </div>
      </TabsContent>

      <TabsContent value="navigation">
        <div className="space-y-6">
          <SocialMediaLineChart
            data={analyticsData}
            title="Overall Navigation Comparison"
            dataKeys={["navigation.forward", "navigation.exited"]}
          />
          <PlatformBarChart
            data={filteredData}
            title="Platform Navigation Breakdown"
            dataKeys={[
              "navigation.forward",
              "navigation.exited",
              "navigation.nextStory",
              "navigation.lookBack",
            ]}
            selectedPlatform={selectedPlatform}
          />
        </div>
      </TabsContent>

      <TabsContent value="profile">
        <div className="space-y-6">
          <SocialMediaLineChart
            data={analyticsData}
            title="Overall Profile Activity Comparison"
            dataKeys={["profile.visits", "profile.follows"]}
          />
          <PlatformBarChart
            data={filteredData}
            title="Platform Profile Activity Breakdown"
            dataKeys={[
              "profile.visits",
              "profile.linkTaps",
              "profile.addressTaps",
              "profile.follows",
            ]}
            selectedPlatform={selectedPlatform}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};