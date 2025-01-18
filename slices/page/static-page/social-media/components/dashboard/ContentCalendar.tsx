import { Card } from "shared/components/ui/card";
import { Calendar } from "lucide-react";

export const ContentCalendar = () => {
  const upcomingPosts = [
    {
      title: "Product Launch Post",
      platform: "Instagram",
      date: "2024-02-20",
      status: "scheduled",
    },
    {
      title: "Weekly Tips Thread",
      platform: "Twitter",
      date: "2024-02-21",
      status: "draft",
    },
    {
      title: "Behind the Scenes Video",
      platform: "TikTok",
      date: "2024-02-22",
      status: "scheduled",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Upcoming Content</h2>
        <Calendar className="text-secondary" size={24} />
      </div>
      <div className="space-y-4">
        {upcomingPosts.map((post) => (
          <div
            key={post.title}
            className="flex items-center justify-between p-4 bg-accent rounded-lg"
          >
            <div>
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {post.platform} • {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                post.status === "scheduled"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};