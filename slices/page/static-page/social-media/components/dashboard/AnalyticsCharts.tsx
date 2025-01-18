import { Card } from "shared/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const AnalyticsCharts = () => {
  const data = [
    { date: "Mon", engagement: 2400 },
    { date: "Tue", engagement: 1398 },
    { date: "Wed", engagement: 9800 },
    { date: "Thu", engagement: 3908 },
    { date: "Fri", engagement: 4800 },
    { date: "Sat", engagement: 3800 },
    { date: "Sun", engagement: 4300 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Weekly Engagement</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#319795"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};