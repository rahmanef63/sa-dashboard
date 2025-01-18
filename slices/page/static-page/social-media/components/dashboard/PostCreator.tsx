import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/components/ui/tabs";
import { Badge } from "shared/components/ui/badge";
import { FileText, Image, Send, CalendarIcon } from "lucide-react";
import { useToast } from "shared/components/ui/use-toast";
import { PostContent } from "./post/PostContent";
import { PostMedia } from "./post/PostMedia";
import { PostPlatform } from "./post/PostPlatform";
import { PostSchedule } from "./post/PostSchedule";
import { PostPreview } from "./post/PostPreview";

export const PostCreator = () => {
  const [date, setDate] = React.useState<Date>();
  const [contentPillar, setContentPillar] = React.useState<string>("");
  const [postContent, setPostContent] = React.useState({
    content: "",
    media: [] as File[],
    platforms: [] as string[],
    manager: "",
    scheduledDate: "",
  });
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setPostContent(prev => ({
      ...prev,
      media: [...prev.media, file]
    }));
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been added to your post`,
      duration: 3000,
    });
  };

  const handleContentUpdate = (content: string) => {
    setPostContent(prev => ({
      ...prev,
      content
    }));
    toast({
      title: "Content updated",
      description: "Your post content has been updated",
      duration: 2000,
    });
  };

  const handlePlatformSelect = (platforms: string[]) => {
    setPostContent(prev => ({
      ...prev,
      platforms
    }));
    toast({
      title: "Platforms updated",
      description: `Your post will be published to ${platforms.length} platform(s)`,
      duration: 2000,
    });
  };

  const handleManagerSelect = (manager: string) => {
    setPostContent(prev => ({
      ...prev,
      manager
    }));
    toast({
      title: "Manager assigned",
      description: `Content manager has been assigned`,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Create New Post</span>
            {contentPillar && (
              <Badge variant="secondary" className="text-sm">
                {contentPillar}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Image className="w-4 h-4 mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="platform" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Send className="w-4 h-4 mr-2" />
                Platform
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <PostContent
                contentPillar={contentPillar}
                setContentPillar={setContentPillar}
                onContentUpdate={handleContentUpdate}
              />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <PostMedia onFileSelect={handleFileSelect} />
            </TabsContent>

            <TabsContent value="platform" className="space-y-6">
              <PostPlatform 
                onPlatformSelect={handlePlatformSelect}
                onManagerSelect={handleManagerSelect}
              />
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <PostSchedule date={date} setDate={setDate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PostPreview
        content={postContent.content}
        media={postContent.media}
        platforms={postContent.platforms}
        manager={postContent.manager}
        date={date}
      />
    </div>
  );
};