import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { Label } from "shared/components/ui/label";

interface MediaFormatSelectorProps {
  mediaType: "image" | "video";
  format: string;
  onFormatChange: (format: string) => void;
}

export const MediaFormatSelector = ({ mediaType, format, onFormatChange }: MediaFormatSelectorProps) => {
  const formats = mediaType === "image" 
    ? [
        { value: "single", label: "Single Post" },
        { value: "carousel", label: "Carousel" },
        { value: "story", label: "Story" },
      ]
    : [
        { value: "single", label: "Single Video" },
        { value: "carousel", label: "Video Carousel" },
        { value: "story", label: "Story" },
        { value: "reel", label: "Reel/TikTok" },
      ];

  return (
    <div className="space-y-2">
      <Label>Format</Label>
      <Select value={format} onValueChange={onFormatChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          {formats.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};