import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "shared/components/ui/card";
import { socialMediaPlatforms } from "../../FormAnalytics/SocialMediaSelect";

interface PlatformBarChartProps {
  data: any[];
  title: string;
  dataKeys: string[];
  selectedPlatform: string;
}

export const PlatformBarChart = ({
  data,
  title,
  dataKeys,
  selectedPlatform,
}: PlatformBarChartProps) => {
  const platformColor = socialMediaPlatforms.find(
    (p) => p.id === selectedPlatform
  )?.color;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={key.split('.').pop()}
                fill={`${platformColor}${(99 - index * 33).toString(16)}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};