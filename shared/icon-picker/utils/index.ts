import { 
  Home, User, Settings, Mail, Calendar, FileText, Image, Music, Video, 
  Folder, ShoppingCart, Bell, Search, Map, Phone, Camera, 
  Clock,  Database, File, Edit, Trash, 
  PlusCircle, ChevronRight, ChevronDown, Menu, Layout, Users, 
  Building, Package, Boxes, Box, ShieldCheck, Lock, Key, Unlock, 
  FileCode, Code, Terminal, GitBranch, Github, 
  Chrome, Monitor, Laptop, Tablet, Smartphone,
  Wifi, Bluetooth, Battery, Power, Zap, Server, HardDrive, Cpu,
  PieChart, BarChart, LineChart, TrendingUp, Activity, Target,
  DollarSign, CreditCard, Wallet, Receipt, Calculator, Percent,
  MessageCircle, MessageSquare, Send, Share, Link, Globe,
  Download, Upload, RefreshCw, RotateCw, ArrowRight, ArrowLeft,
  Plus, Minus, X, Check, AlertTriangle, AlertCircle, Info,
  // Adding new icons
  LayoutDashboard, CheckSquare, CircleUser, UserCircle, 
  Files, FolderOpen, FolderTree, FilePlus, FileEdit,
  Table, TableProperties, Grid, List, ListTodo,
  ChartPie, ChartBar, ChartLine,
  BookOpen, BookMarked, Library,
  Shield, ShieldAlert, ShieldCheck as ShieldCheckIcon,
  BellRing, BellPlus, BellMinus,
  Gauge, Timer, TimerReset,
  Settings2, Wrench,
  Network, Share2, Signal,
  Kanban, Trello, ClipboardList,
  Tag, Tags, Bookmark as BookmarkIcon,
  Flag, FlagTriangleRight, Award,
  // New navigation startup icons
  Store, Inbox, Layers, Command, Briefcase, 
  BarChart2, PieChart as PieChartIcon, 
  Workflow, GitPullRequest, Boxes as BoxesIcon,
  Rocket, Sparkles, Lightbulb, Puzzle,
  Target as TargetIcon, Crosshair, Compass as CompassIcon,
  Bot, Brain, Cpu as CpuIcon, CircuitBoard,
  Factory, Building2,
  Blocks, AppWindow, Maximize
} from 'lucide-react'
import { type LucideIcon, type LucideProps } from 'lucide-react'
import React from 'react'

export interface IconOption {
  name: string;
  icon: LucideIcon;
}

export const iconOptions: IconOption[] = [
  // Navigation & UI
  { name: 'Home', icon: Home },
  { name: 'Menu', icon: Menu },
  { name: 'Layout', icon: Layout },
  { name: 'LayoutDashboard', icon: LayoutDashboard },
  { name: 'ChevronRight', icon: ChevronRight },
  { name: 'ChevronDown', icon: ChevronDown },
  { name: 'ArrowRight', icon: ArrowRight },
  { name: 'ArrowLeft', icon: ArrowLeft },
  
  // Startup & Business
  { name: 'Store', icon: Store },
  { name: 'Rocket', icon: Rocket },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Puzzle', icon: Puzzle },
  { name: 'Target', icon: TargetIcon },
  { name: 'Crosshair', icon: Crosshair },
  { name: 'Compass', icon: CompassIcon },
  { name: 'Factory', icon: Factory },
  { name: 'Building2', icon: Building2 },
  { name: 'Blocks', icon: Blocks },
  { name: 'AppWindow', icon: AppWindow },
  { name: 'Maximize', icon: Maximize },
  
  // Technology & Development
  { name: 'Bot', icon: Bot },
  { name: 'Brain', icon: Brain },
  { name: 'Cpu', icon: CpuIcon },
  { name: 'CircuitBoard', icon: CircuitBoard },
  { name: 'Workflow', icon: Workflow },
  { name: 'GitPullRequest', icon: GitPullRequest },
  { name: 'Boxes', icon: BoxesIcon },
  
  // Analytics & Business
  { name: 'BarChart2', icon: BarChart2 },
  { name: 'PieChart', icon: PieChartIcon },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Command', icon: Command },
  { name: 'Layers', icon: Layers },
  
  // Actions
  { name: 'Edit', icon: Edit },
  { name: 'Trash', icon: Trash },
  { name: 'PlusCircle', icon: PlusCircle },
  { name: 'Plus', icon: Plus },
  { name: 'Minus', icon: Minus },
  { name: 'X', icon: X },
  { name: 'Check', icon: Check },
  { name: 'CheckSquare', icon: CheckSquare },
  
  // Users & Organizations
  { name: 'User', icon: User },
  { name: 'Users', icon: Users },
  { name: 'CircleUser', icon: CircleUser },
  { name: 'UserCircle', icon: UserCircle },
  { name: 'Building', icon: Building },
  
  // Content & Media
  { name: 'File', icon: File },
  { name: 'Files', icon: Files },
  { name: 'FileText', icon: FileText },
  { name: 'FileCode', icon: FileCode },
  { name: 'FilePlus', icon: FilePlus },
  { name: 'FileEdit', icon: FileEdit },
  { name: 'Image', icon: Image },
  { name: 'Video', icon: Video },
  { name: 'Music', icon: Music },
  { name: 'Folder', icon: Folder },
  { name: 'FolderOpen', icon: FolderOpen },
  { name: 'FolderTree', icon: FolderTree },
  
  // Layout & Views
  { name: 'Table', icon: Table },
  { name: 'TableProperties', icon: TableProperties },
  { name: 'Grid', icon: Grid },
  { name: 'List', icon: List },
  { name: 'ListTodo', icon: ListTodo },
  { name: 'Kanban', icon: Kanban },
  { name: 'Trello', icon: Trello },
  { name: 'ClipboardList', icon: ClipboardList },
  
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
  { name: 'Network', icon: Network },
  { name: 'Share2', icon: Share2 },
  { name: 'Signal', icon: Signal },
  
  // Data & Analytics
  { name: 'Database', icon: Database },
  { name: 'PieChart', icon: PieChart },
  { name: 'BarChart', icon: BarChart },
  { name: 'LineChart', icon: LineChart },
  { name: 'ChartPie', icon: ChartPie },
  { name: 'ChartBar', icon: ChartBar },
  { name: 'ChartLine', icon: ChartLine },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Activity', icon: Activity },
  { name: 'Gauge', icon: Gauge },
  
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
  { name: 'Timer', icon: Timer },
  { name: 'TimerReset', icon: TimerReset },
  
  // Status & Notifications
  { name: 'Bell', icon: Bell },
  { name: 'BellRing', icon: BellRing },
  { name: 'BellPlus', icon: BellPlus },
  { name: 'BellMinus', icon: BellMinus },
  { name: 'AlertTriangle', icon: AlertTriangle },
  { name: 'AlertCircle', icon: AlertCircle },
  { name: 'Info', icon: Info },
  
  // Security
  { name: 'ShieldCheck', icon: ShieldCheckIcon },
  { name: 'Shield', icon: Shield },
  { name: 'ShieldAlert', icon: ShieldAlert },
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
  
  // Settings
  { name: 'Settings', icon: Settings },
  { name: 'Settings2', icon: Settings2 },
  { name: 'Wrench', icon: Wrench },
  
  // Tags & Categories
  { name: 'Tag', icon: Tag },
  { name: 'Tags', icon: Tags },
  { name: 'Bookmark', icon: BookmarkIcon },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'BookMarked', icon: BookMarked },
  { name: 'Library', icon: Library },
  { name: 'Flag', icon: Flag },
  { name: 'FlagTriangleRight', icon: FlagTriangleRight },
  { name: 'Award', icon: Award },
  
  // Misc
  { name: 'Search', icon: Search },
  { name: 'Map', icon: Map },
  { name: 'Phone', icon: Phone },
  { name: 'Camera', icon: Camera },
  { name: 'Download', icon: Download },
  { name: 'Upload', icon: Upload },
  { name: 'RefreshCw', icon: RefreshCw },
  { name: 'RotateCw', icon: RotateCw }
]

export const getIconByName = (name: string): LucideIcon | undefined => {
  const option = iconOptions.find(opt => opt.name === name);
  return option?.icon;
}

// Helper to render an icon component with props
export const renderIcon = (icon: string | LucideIcon | undefined, props?: LucideProps): JSX.Element | null => {
  if (!icon) return null;
  
  if (typeof icon === 'string') {
    const IconComponent = getIconByName(icon);
    if (!IconComponent) return null;
    return React.createElement(IconComponent, props);
  }
  
  return React.createElement(icon, props);
}
