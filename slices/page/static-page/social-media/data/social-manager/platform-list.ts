import { LucideIcon, Music2, Youtube, X, Linkedin, Instagram, Facebook, Store, ShoppingBag } from "lucide-react";

export type Platform = "x" | "linkedin" | "instagram" | "facebook" | "tiktok" | "youtube" | "shopee" | "tokopedia";

export interface PlatformConfig {
  id: Platform;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const PLATFORMS: PlatformConfig[] = [
  { id: "x", label: "X", icon: X, color: "#000000" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { id: "tiktok", label: "TikTok", icon: Music2, color: "#000000" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { id: "shopee", label: "Shopee", icon: ShoppingBag, color: "#EE4D2D" },
  { id: "tokopedia", label: "Tokopedia", icon: Store, color: "#42B549" },
];