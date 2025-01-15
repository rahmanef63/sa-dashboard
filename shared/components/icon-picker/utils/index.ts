import { Home, User, Settings, Mail, Calendar, FileText, Image, Music, Video, Folder, ShoppingCart, Heart, Star, Bell, Search, Map, Phone, Camera, Bookmark, Clock, Cloud, Coffee, Compass, Database } from 'lucide-react'
import { IconOption } from '../types'

export const iconOptions: IconOption[] = [
  { name: 'Home', icon: Home },
  { name: 'User', icon: User },
  { name: 'Settings', icon: Settings },
  { name: 'Mail', icon: Mail },
  { name: 'Calendar', icon: Calendar },
  { name: 'FileText', icon: FileText },
  { name: 'Image', icon: Image },
  { name: 'Music', icon: Music },
  { name: 'Video', icon: Video },
  { name: 'Folder', icon: Folder },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Bell', icon: Bell },
  { name: 'Search', icon: Search },
  { name: 'Map', icon: Map },
  { name: 'Phone', icon: Phone },
  { name: 'Camera', icon: Camera },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Clock', icon: Clock },
  { name: 'Cloud', icon: Cloud },
  { name: 'Coffee', icon: Coffee },
  { name: 'Compass', icon: Compass },
  { name: 'Database', icon: Database }
]

export const getIconByName = (name: string) => {
  return iconOptions.find(option => option.name === name)?.icon || Home
}

