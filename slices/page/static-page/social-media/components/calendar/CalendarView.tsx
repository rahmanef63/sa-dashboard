import React from "react";
import { Calendar } from "shared/components/ui/calendar";
import { Card } from "shared/components/ui/card";
import { ScrollArea } from "shared/components/ui/scroll-area";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowUpDown } from "lucide-react";
import { Button } from "shared/components/ui/button";
import { Post } from "../../data/social-manager/PostManager/dummydata";
import { dummyPosts } from "../../data/social-manager/PostManager/dummydata";

export const CalendarView = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [mounted, setMounted] = React.useState(false);
  const [sortAscending, setSortAscending] = React.useState(true);
  
  React.useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

  const scheduledPosts = dummyPosts.filter(
    post => post.status === "scheduled" || post.status === "draft"
  );

  const sortedPosts = React.useMemo(() => {
    return [...scheduledPosts]
      .sort((a, b) => {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return sortAscending ? dateA - dateB : dateB - dateA;
      });
  }, [scheduledPosts, sortAscending]);

  const renderPlatform = (platform: any) => {
    if (typeof platform === 'string') return platform;
    return platform.name || 'Unknown Platform';
  };

  return (
    <Card className="p-4 sm:p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Content Calendar</h2>
        <CalendarIcon className="text-secondary" size={24} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0">
        <div className="w-full max-w-[400px] mx-auto lg:max-w-none">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="space-y-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-medium text-sm sm:text-base">Scheduled Posts</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortAscending(!sortAscending)}
              className="gap-2 text-xs sm:text-sm"
            >
              Sort by date
              <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {sortedPosts.map((post, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-accent rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-medium text-sm sm:text-base line-clamp-1">{post.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs whitespace-nowrap ${
                      post.status === "scheduled" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {post.scheduledDate ? format(new Date(post.scheduledDate), "PPP") : "No date"} • {renderPlatform(post.platform)}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};