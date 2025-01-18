import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/components/ui/select";

export const socialMediaPlatforms = [
  { id: "instagram", name: "Instagram", color: "#9b87f5" },
  { id: "facebook", name: "Facebook", color: "#0EA5E9" },
  { id: "twitter", name: "Twitter", color: "#1EAEDB" },
  { id: "tiktok", name: "TikTok", color: "#F97316" },
];

interface SocialMediaSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const SocialMediaSelect = ({ value, onValueChange }: SocialMediaSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Platform" />
      </SelectTrigger>
      <SelectContent>
        {socialMediaPlatforms.map((platform) => (
          <SelectItem key={platform.id} value={platform.id}>
            {platform.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};