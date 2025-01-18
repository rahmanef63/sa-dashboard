import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";
import { AnalyticsForm } from "./AdvancedAnalytics/FormAnalytics/AnalyticsForm";
import { AnalyticsCharts } from "./AdvancedAnalytics/ChartAnalytics/AnalyticsCharts";

export const AdvancedAnalytics = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");

  return (
    <Tabs defaultValue="data" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="data">Data Input</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
      </TabsList>

      <TabsContent value="data">
        <AnalyticsForm
          platform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
      </TabsContent>

      <TabsContent value="charts">
        <AnalyticsCharts selectedPlatform={selectedPlatform} />
      </TabsContent>
    </Tabs>
  );
};