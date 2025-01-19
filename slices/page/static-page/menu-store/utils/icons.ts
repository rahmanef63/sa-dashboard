import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react';

export const iconList = Object.keys(Icons)
  .filter(key => typeof Icons[key as keyof typeof Icons] === 'function');

export function getIconComponent(iconName: string): LucideIcon {
  const icon = require('lucide-react')[iconName];
  if (!icon) {
    throw new Error(`Icon ${iconName} not found`);
  }
  return icon;
}
