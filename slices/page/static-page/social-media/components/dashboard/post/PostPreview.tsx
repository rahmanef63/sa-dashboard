import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "shared/components/ui/card";
import { Badge } from "shared/components/ui/badge";
import { FileText, Image, Send, CalendarIcon, Copy, Play } from "lucide-react";
import { format } from "date-fns";
import { Button } from "shared/components/ui/button";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "shared/components/ui/carousel";

import { getPlatformIcon, getPlatformColor } from "./PostPlatform/utils";

interface PostPreviewProps {
  content: string;
  media: File[];
  platforms: string[];
  manager: string;
  date?: Date;
  contentPillar?: string;
}

const MediaPreviewItem: React.FC<{ file: File }> = ({ file }) => {
  const [objectUrl, setObjectUrl] = React.useState<string>("");

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (isImage) {
    return (
      <div className="relative w-full h-full aspect-square">
        <img
          src={objectUrl}
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover rounded-md"
        />
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative w-full h-full aspect-square bg-black/10 rounded-md">
        <video
          src={objectUrl}
          className="absolute inset-0 w-full h-full object-cover rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-12 h-12 text-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image className="w-8 h-8 text-muted-foreground mb-2" />
      <p className="text-xs text-center text-muted-foreground break-all px-2">
        {file.name}
      </p>
    </div>
  );
};

export const PostPreview: React.FC<PostPreviewProps> = ({
  content,
  media,
  platforms,
  manager,
  date,
  contentPillar,
}) => {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Post Preview
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {contentPillar && (
              <Badge variant="outline" className="bg-primary/10 text-xs sm:text-sm">
                {contentPillar}
              </Badge>
            )}
            {platforms.map((platformId) => {
              const Icon = getPlatformIcon(platformId);
              const color = getPlatformColor(platformId);
              return Icon ? (
                <Badge key={platformId} variant="outline" className="capitalize bg-accent/50 text-xs sm:text-sm">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" style={{ color }} />
                  {platformId}
                </Badge>
              ) : null;
            })}
            {manager && (
              <Badge variant="outline" className="bg-secondary text-xs sm:text-sm">
                {manager}
              </Badge>
            )}
            {date && (
              <Badge variant="outline" className="bg-muted text-xs sm:text-sm">
                <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {format(date, "PPp")}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(content || media.length > 0) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {media.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="font-medium text-base sm:text-lg">Media</h3>
                </div>
                <Carousel className="w-full">
                  <CarouselContent>
                    {media.map((file, index) => (
                      <CarouselItem key={index}>
                        <Card className="aspect-square bg-accent/50">
                          <MediaPreviewItem file={file} />
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {media.length > 1 && (
                    <>
                      <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-12" />
                      <CarouselNext className="hidden sm:flex -right-4 sm:-right-12" />
                    </>
                  )}
                </Carousel>
              </div>
            )}
            
            {content && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h3 className="font-medium text-base sm:text-lg">Content</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                    onClick={handleCopyContent}
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    Copy
                  </Button>
                </div>
                <Card className="bg-accent/50 border border-accent hover:bg-accent/60 transition-colors">
                  <CardContent className="pt-4 sm:pt-6">
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <Card className="border border-dashed">
            <CardContent className="py-8 sm:py-12">
              <div className="text-center text-muted-foreground">
                <Image className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-xs sm:text-sm">Start creating your post to see the preview here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
