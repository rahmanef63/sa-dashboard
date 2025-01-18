import { Card } from "shared/components/ui/card";
import { Users, TrendingUp, MessageCircle, Share2 } from "lucide-react";

export const AudienceInsights = () => {
  const insights = [
    {
      title: "Most Active Time",
      value: "2 PM - 4 PM",
      change: "+15%",
      icon: Users,
    },
    {
      title: "Top Performing Content",
      value: "Video Posts",
      change: "+32%",
      icon: TrendingUp,
    },
    {
      title: "Engagement Rate",
      value: "5.8%",
      change: "+2.1%",
      icon: MessageCircle,
    },
    {
      title: "Share Rate",
      value: "3.2%",
      change: "+0.8%",
      icon: Share2,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Audience Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="p-4 bg-accent rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <insight.icon className="text-primary h-5 w-5" />
              <span className="text-sm text-green-600">{insight.change}</span>
            </div>
            <h3 className="font-medium text-sm text-gray-600">{insight.title}</h3>
            <p className="text-lg font-bold mt-1">{insight.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};