import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "shared/components/ui/card";
import { socialMediaPlatforms } from "../../FormAnalytics/SocialMediaSelect";

interface SocialMediaLineChartProps {
  data: any[];
  title: string;
  dataKeys: string[];
}

export const SocialMediaLineChart = ({
  data,
  title,
  dataKeys,
}: SocialMediaLineChartProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key.split('.').pop()}
                stroke={socialMediaPlatforms[index % socialMediaPlatforms.length].color}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};