import React from "react";
import { Card, CardContent } from "shared/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "shared/components/ui/hover-card";
import { Checkbox } from "shared/components/ui/checkbox";
import { Label } from "shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "shared/components/ui/avatar";
import { UserRound } from "lucide-react";
import { Button } from "shared/components/ui/button";
import { PLATFORMS } from "@/slices/page/dynamic-page/social-media/data/social-manager/platform-list";
import { users } from "@/slices/page/dynamic-page/social-media/data/social-manager/user";
import type { PostPlatformProps } from "./types";

export const PostPlatform: React.FC<PostPlatformProps> = ({ 
  onPlatformSelect,
  onManagerSelect 
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    const updatedPlatforms = checked
      ? [...selectedPlatforms, platformId]
      : selectedPlatforms.filter(id => id !== platformId);
    
    setSelectedPlatforms(updatedPlatforms);
    onPlatformSelect(updatedPlatforms);
  };

  const handleSelectAll = () => {
    const allPlatformIds = PLATFORMS.map(platform => platform.id);
    if (selectedPlatforms.length === PLATFORMS.length) {
      setSelectedPlatforms([]);
      onPlatformSelect([]);
    } else {
      setSelectedPlatforms(allPlatformIds);
      onPlatformSelect(allPlatformIds);
    }
  };

  return (
    <Card className="border border-border/50">
      <CardContent className="pt-6 px-2 sm:px-4 md:px-6">
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2 sm:mb-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <label className="text-sm font-medium cursor-help">
                    Select Platforms
                  </label>
                </HoverCardTrigger>
                <HoverCardContent className="text-sm">
                  Choose one or more platforms to publish your post
                </HoverCardContent>
              </HoverCard>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs whitespace-nowrap"
              >
                {selectedPlatforms.length === PLATFORMS.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div 
                    key={platform.id} 
                    className="flex items-center space-x-2 p-2 hover:bg-accent/50 rounded-lg transition-colors"
                  >
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => 
                        handlePlatformChange(platform.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={platform.id}
                      className="flex items-center gap-2 cursor-pointer text-sm w-full"
                    >
                      <Icon 
                        className="w-4 h-4 flex-shrink-0" 
                        style={{ color: platform.color }}
                      />
                      <span className="truncate">{platform.label}</span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2 sm:pt-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <label className="text-sm font-medium block cursor-help">
                  Content Manager
                </label>
              </HoverCardTrigger>
              <HoverCardContent className="text-sm">
                Select who will manage this content
              </HoverCardContent>
            </HoverCard>
            <Select onValueChange={onManagerSelect}>
              <SelectTrigger className="w-full bg-accent/50 hover:bg-accent/70 transition-colors">
                <SelectValue placeholder="Choose manager" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};