import React from "react";
import { Card, CardContent } from "shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { ScrollArea } from "shared/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "shared/components/ui/hover-card";
import { ContentPillarTemplate } from "../ContentPillarTemplate";
import { Badge } from "shared/components/ui/badge";
import { differenceInDays } from "date-fns";

interface PostContentProps {
  contentPillar: string;
  setContentPillar: (value: string) => void;
  onContentUpdate: (content: string) => void;
}

interface ContentPillarData {
  name: string;
  lastUsed: Date | null;
}

export const PostContent: React.FC<PostContentProps> = ({
  contentPillar,
  setContentPillar,
  onContentUpdate,
}) => {
  // Simulated data - in a real app, this would come from your backend
  const contentPillars: ContentPillarData[] = [
    { name: "Interaksi", lastUsed: new Date(2024, 3, 1) },
    { name: "Edukasi", lastUsed: new Date(2024, 3, 10) },
    { name: "Emosional", lastUsed: new Date(2024, 2, 15) },
    { name: "Hard Selling", lastUsed: new Date(2024, 3, 5) },
    { name: "Soft Selling", lastUsed: null },
    { name: "Story Telling", lastUsed: new Date(2024, 3, 8) },
    { name: "Social Proof", lastUsed: new Date(2024, 3, 12) },
    { name: "Personal Branding", lastUsed: new Date(2024, 2, 20) },
    { name: "Catalogue", lastUsed: new Date(2024, 3, 15) },
    { name: "KOL Brief", lastUsed: null },
    { name: "Produk", lastUsed: new Date(2024, 3, 7) },
    { name: "Pengumuman", lastUsed: new Date(2024, 3, 2) },
    { name: "Aset Marketing", lastUsed: new Date(2024, 3, 9) }
  ];

  const getLastUsedText = (date: Date | null): string => {
    if (!date) return "Never used";
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff === 0) return "Used today";
    if (daysDiff === 1) return "Used yesterday";
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 14) return "1 week ago";
    if (daysDiff < 21) return "2 weeks ago";
    if (daysDiff < 28) return "3 weeks ago";
    return "Over a month ago";
  };

  const getLastUsedColor = (date: Date | null): string => {
    if (!date) return "bg-secondary text-secondary-foreground";
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff < 7) return "bg-green-500/10 text-green-700 border-green-500/20";
    if (daysDiff < 14) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  return (
    <Card className="border border-border/50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <label className="text-sm font-medium mb-2 block cursor-help">
                  Content Pillar
                </label>
              </HoverCardTrigger>
              <HoverCardContent>
                Choose a content pillar to help structure your post
              </HoverCardContent>
            </HoverCard>
            <Select value={contentPillar} onValueChange={setContentPillar}>
              <SelectTrigger className="w-full bg-accent/50 hover:bg-accent/70 transition-colors">
                <SelectValue placeholder="Choose content pillar" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {contentPillars.map((pillar) => (
                    <SelectItem 
                      key={pillar.name} 
                      value={pillar.name}
                      className="hover:bg-accent/50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full gap-8 pr-4">
                        <span className="flex-shrink-0">{pillar.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] whitespace-nowrap ${getLastUsedColor(pillar.lastUsed)}`}
                        >
                          {getLastUsedText(pillar.lastUsed)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          {contentPillar && (
            <ContentPillarTemplate 
              pillar={contentPillar} 
              onContentUpdate={onContentUpdate}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};