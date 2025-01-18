import { LucideIcon } from "lucide-react";

export interface Platform {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface ContentManager {
  id: string;
  name: string;
  avatar: string;
  userId?: string;
}

export interface PostPlatformProps {
  onPlatformSelect: (platforms: string[]) => void;
  onManagerSelect: (manager: string) => void;
}