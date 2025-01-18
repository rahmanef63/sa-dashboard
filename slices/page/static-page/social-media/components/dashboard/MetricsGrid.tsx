import { Card } from "shared/components/ui/card";
import { ArrowUp, ArrowDown, Users, Share2, Heart, Eye } from "lucide-react";

export const MetricsGrid = () => {
  const metrics = [
    {
      title: "Total Followers",
      value: "12.5K",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      change: "+0.8%",
      trend: "up",
      icon: Heart,
    },
    {
      title: "Total Shares",
      value: "843",
      change: "-2%",
      trend: "down",
      icon: Share2,
    },
    {
      title: "Impressions",
      value: "45.2K",
      change: "+24%",
      trend: "up",
      icon: Eye,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{metric.title}</p>
              <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
            </div>
            <metric.icon className="text-secondary" size={24} />
          </div>
          <div className="flex items-center mt-4">
            {metric.trend === "up" ? (
              <ArrowUp className="text-green-500 mr-1" size={16} />
            ) : (
              <ArrowDown className="text-red-500 mr-1" size={16} />
            )}
            <span
              className={`text-sm ${
                metric.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {metric.change} vs last month
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};