import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent } from "shared/components/ui/card";
import { Separator } from "shared/components/ui/separator";
import { ACCEPTED_FILE_TYPES } from "../../../../config/media/constants";

const MediaTypeSelector = dynamic(() => import('./MediaTypeSelector').then(mod => mod.MediaTypeSelector), {
  ssr: false
});

const MediaFormatSelector = dynamic(() => import('./MediaFormatSelector').then(mod => mod.MediaFormatSelector), {
  ssr: false
});

const MediaUploader = dynamic(() => import('../../../../components/media/MediaUploader').then(mod => mod.MediaUploader), {
  ssr: false
});

interface MediaConfigPanelProps {
  onFileSelect: (file: File) => void;
}

export const MediaConfigPanel = ({ onFileSelect }: MediaConfigPanelProps) => {
  const [mounted, setMounted] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [format, setFormat] = useState("single");

  useEffect(() => {
    setMounted(true);
  }, []);

  const acceptedTypes = mediaType === "image" 
    ? ['IMAGE'] as (keyof typeof ACCEPTED_FILE_TYPES)[]
    : ['VIDEO'] as (keyof typeof ACCEPTED_FILE_TYPES)[];

  const maxFiles = format === "single" ? 1 : 10;

  if (!mounted) {
    return <Card className="border border-border/50"><CardContent className="space-y-6 pt-6">Loading...</CardContent></Card>;
  }

  return (
    <Card className="border border-border/50">
      <CardContent className="space-y-6 pt-6">
        <div>
          <h3 className="text-sm font-medium mb-4">Select Media Type</h3>
          <MediaTypeSelector
            selectedType={mediaType}
            onTypeChange={setMediaType}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-4">Configure Format</h3>
          <MediaFormatSelector
            mediaType={mediaType}
            format={format}
            onFormatChange={setFormat}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-4">Upload Media</h3>
          <MediaUploader
            onFileSelect={onFileSelect}
            acceptedTypes={acceptedTypes}
            maxFiles={maxFiles}
          />
        </div>
      </CardContent>
    </Card>
  );
};