import { 
  Home, User, Settings, Mail, Calendar, FileText, Image, Music, Video, 
  Folder, ShoppingCart, Heart, Star, Bell, Search, Map, Phone, Camera, 
  Bookmark, Clock, Cloud, Coffee, Compass, Database, File, Edit, Trash, 
  PlusCircle, ChevronRight, ChevronDown, Menu, Layout, Users, 
  Building, Package, Boxes, Box, ShieldCheck, Lock, Key, Unlock, 
  FileCode, Code, Terminal, GitBranch, Github, 
  Chrome, Monitor, Laptop, Tablet, Smartphone,
  Wifi, Bluetooth, Battery, Power, Zap, Server, HardDrive, Cpu,
  PieChart, BarChart, LineChart, TrendingUp, Activity, Target,
  DollarSign, CreditCard, Wallet, Receipt, Calculator, Percent,
  MessageCircle, MessageSquare, Send, Share, Link, Globe,
  Download, Upload, RefreshCw, RotateCw, ArrowRight, ArrowLeft,
  Plus, Minus, X, Check, AlertTriangle, AlertCircle, Info
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

export interface IconOption {
  name: string;
  icon: LucideIcon;
}

export const iconOptions: IconOption[] = [
  // Navigation & UI
  { name: 'Home', icon: Home },
  { name: 'Menu', icon: Menu },
  { name: 'Layout', icon: Layout },
  { name: 'ChevronRight', icon: ChevronRight },
  { name: 'ChevronDown', icon: ChevronDown },
  { name: 'ArrowRight', icon: ArrowRight },
  { name: 'ArrowLeft', icon: ArrowLeft },
  
  // Actions
  { name: 'Edit', icon: Edit },
  { name: 'Trash', icon: Trash },
  { name: 'PlusCircle', icon: PlusCircle },
  { name: 'Plus', icon: Plus },
  { name: 'Minus', icon: Minus },
  { name: 'X', icon: X },
  { name: 'Check', icon: Check },
  
  // Users & Organizations
  { name: 'User', icon: User },
  { name: 'Users', icon: Users },
  { name: 'Building', icon: Building },
  
  // Content & Media
  { name: 'File', icon: File },
  { name: 'FileText', icon: FileText },
  { name: 'FileCode', icon: FileCode },
  { name: 'Image', icon: Image },
  { name: 'Video', icon: Video },
  { name: 'Music', icon: Music },
  { name: 'Folder', icon: Folder },
  
  // Development
  { name: 'Code', icon: Code },
  { name: 'Terminal', icon: Terminal },
  { name: 'GitBranch', icon: GitBranch },
  { name: 'Github', icon: Github },
  
  // Devices & Hardware
  { name: 'Monitor', icon: Monitor },
  { name: 'Laptop', icon: Laptop },
  { name: 'Tablet', icon: Tablet },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Server', icon: Server },
  { name: 'HardDrive', icon: HardDrive },
  { name: 'Cpu', icon: Cpu },
  
  // Connectivity
  { name: 'Wifi', icon: Wifi },
  { name: 'Bluetooth', icon: Bluetooth },
  { name: 'Globe', icon: Globe },
  
  // Data & Analytics
  { name: 'Database', icon: Database },
  { name: 'PieChart', icon: PieChart },
  { name: 'BarChart', icon: BarChart },
  { name: 'LineChart', icon: LineChart },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Activity', icon: Activity },
  
  // Finance
  { name: 'DollarSign', icon: DollarSign },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Wallet', icon: Wallet },
  { name: 'Receipt', icon: Receipt },
  { name: 'Calculator', icon: Calculator },
  { name: 'Percent', icon: Percent },
  
  // Communication
  { name: 'Mail', icon: Mail },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Send', icon: Send },
  { name: 'Share', icon: Share },
  { name: 'Link', icon: Link },
  
  // Time & Calendar
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  
  // Status & Notifications
  { name: 'Bell', icon: Bell },
  { name: 'AlertTriangle', icon: AlertTriangle },
  { name: 'AlertCircle', icon: AlertCircle },
  { name: 'Info', icon: Info },
  
  // Security
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Lock', icon: Lock },
  { name: 'Unlock', icon: Unlock },
  { name: 'Key', icon: Key },
  
  // Power & Energy
  { name: 'Battery', icon: Battery },
  { name: 'Power', icon: Power },
  { name: 'Zap', icon: Zap },
  
  // Shopping & Commerce
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Package', icon: Package },
  { name: 'Boxes', icon: Boxes },
  { name: 'Box', icon: Box },
  
  // Browsers
  { name: 'Chrome', icon: Chrome },
  
  // Misc
  { name: 'Search', icon: Search },
  { name: 'Map', icon: Map },
  { name: 'Phone', icon: Phone },
  { name: 'Camera', icon: Camera },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Cloud', icon: Cloud },
  { name: 'Coffee', icon: Coffee },
  { name: 'Compass', icon: Compass },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Download', icon: Download },
  { name: 'Upload', icon: Upload },
  { name: 'RefreshCw', icon: RefreshCw },
  { name: 'RotateCw', icon: RotateCw }
]

export const getIconByName = (name: string) => {
  const option = iconOptions.find(opt => opt.name === name);
  return option?.icon;
}
