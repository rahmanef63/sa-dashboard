import { RadioGroup, RadioGroupItem } from "shared/components/ui/radio-group";
import { Label } from "shared/components/ui/label";
import { Image, Film } from "lucide-react";

interface MediaTypeSelectorProps {
  selectedType: "image" | "video";
  onTypeChange: (type: "image" | "video") => void;
}

export const MediaTypeSelector = ({ selectedType, onTypeChange }: MediaTypeSelectorProps) => {
  return (
    <RadioGroup
      defaultValue={selectedType}
      onValueChange={(value) => onTypeChange(value as "image" | "video")}
      className="grid grid-cols-2 gap-4"
    >
      <div>
        <RadioGroupItem
          value="image"
          id="image"
          className="peer sr-only"
        />
        <Label
          htmlFor="image"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Image className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">Image</span>
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value="video"
          id="video"
          className="peer sr-only"
        />
        <Label
          htmlFor="video"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Film className="mb-2 h-6 w-6" />
          <span className="text-sm font-medium">Video</span>
        </Label>
      </div>
    </RadioGroup>
  );
};