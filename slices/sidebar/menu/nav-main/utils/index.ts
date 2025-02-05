import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { MenuItem, SubMenuItem, GroupLabel, NavUrl } from '@/slices/sidebar/menu/types/'

export function getIconComponent(iconName: string): LucideIcon {
  if (!iconName) return Icons.HelpCircle;
  return (Icons[iconName as keyof typeof Icons] || Icons.HelpCircle) as LucideIcon;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatUrl(url: string): string {
  if (!url) return '/';
  return url.startsWith('/') ? url : `/${url}`;
}

export function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function checkSubmenuAvailability(item: MenuItem): boolean {
  return Boolean(item.items && item.items.length > 0);
}

export function createNewMenuItem(
  title: string,
  url: string,
  icon: string = 'FileText',
  groupId?: string
): MenuItem {
  return {
    id: generateId(),
    title,
    url: {
      href: formatUrl(url),
      target: '_self',
    },
    icon: getIconComponent(icon),
    groupId,
    items: [],
    order: Date.now(),
  };
}

export function createNewSubMenuItem(
  title: string,
  url: string,
  parentId: string,
  icon: string = 'FileText'
): SubMenuItem {
  return {
    id: generateId(),
    title,
    url: {
      href: formatUrl(url),
      target: '_self'
    },
    parentId,
    icon: getIconComponent(icon)
  };
}

export function createNewGroupLabel(title: string): GroupLabel {
  return {
    id: generateId(),
    title,
    order: Date.now(),
  };
}
