import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  FileText,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Frame,
  PieChart,
  Map,
  UserCircle,
  Bell,
  Lock,
  HelpCircle,
  Inbox,
  Send,
  Archive,
  Trash
} from "lucide-react"
import type { NavItem, TeamType, ProjectType, UserType } from "../types/dashboard"

export const navigationItems: NavItem[] = [
  { 
    id: 'dashboard', 
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/dashboard'
  },
  { 
    id: 'projects', 
    title: 'Projects',
    icon: <FolderKanban className="h-4 w-4" />,
    children: [
      { 
        id: 'projects-active', 
        title: 'Active Projects',
        icon: <FileText className="h-4 w-4" />,
        href: '/dashboard/projects/active'
      },
      { 
        id: 'projects-archived', 
        title: 'Archived Projects',
        icon: <FileText className="h-4 w-4" />,
        href: '/dashboard/projects/archived'
      }
    ]
  },
  {
    id: 'mail',
    title: 'Mail',
    icon: <Inbox className="h-4 w-4" />,
    isCollapsible: true,
    children: [
      {
        id: 'mail-inbox',
        title: 'Inbox',
        icon: <Inbox className="h-4 w-4" />,
        href: '/dashboard/mail/inbox'
      },
      {
        id: 'mail-sent',
        title: 'Sent',
        icon: <Send className="h-4 w-4" />,
        href: '/dashboard/mail/sent'
      },
      {
        id: 'mail-archived',
        title: 'Archived',
        icon: <Archive className="h-4 w-4" />,
        href: '/dashboard/mail/archived'
      },
      {
        id: 'mail-trash',
        title: 'Trash',
        icon: <Trash className="h-4 w-4" />,
        href: '/dashboard/mail/trash'
      }
    ]
  },
  { 
    id: 'team', 
    title: 'Team',
    icon: <Users className="h-4 w-4" />,
    children: [
      { 
        id: 'team-members', 
        title: 'Members',
        icon: <UserCircle className="h-4 w-4" />,
        href: '/dashboard/team/members'
      },
      { 
        id: 'team-settings', 
        title: 'Settings',
        icon: <Settings className="h-4 w-4" />,
        href: '/dashboard/team/settings'
      }
    ]
  },
  { 
    id: 'settings', 
    title: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    isCollapsible: true,
    children: [
      { 
        id: 'settings-profile', 
        title: 'Profile',
        icon: <UserCircle className="h-4 w-4" />,
        href: '/dashboard/settings/profile'
      },
      { 
        id: 'settings-notifications', 
        title: 'Notifications',
        icon: <Bell className="h-4 w-4" />,
        href: '/dashboard/settings/notifications'
      },
      { 
        id: 'settings-security', 
        title: 'Security',
        icon: <Lock className="h-4 w-4" />,
        href: '/dashboard/settings/security'
      },
      { 
        id: 'settings-help', 
        title: 'Help & Support',
        icon: <HelpCircle className="h-4 w-4" />,
        href: '/dashboard/settings/help'
      }
    ]
  }
]

export const teams: TeamType[] = [
  {
    id: '1',
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise"
  },
  {
    id: '2',
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup"
  },
  {
    id: '3',
    name: "Evil Corp.",
    logo: Command,
    plan: "Free"
  }
]

export const projects: ProjectType[] = [
  {
    id: '1',
    name: "Design Engineering",
    url: "/dashboard/projects/design",
    icon: Frame
  },
  {
    id: '2',
    name: "Sales & Marketing",
    url: "/dashboard/projects/sales",
    icon: PieChart
  },
  {
    id: '3',
    name: "Travel",
    url: "/dashboard/projects/travel",
    icon: Map
  }
]

export const defaultUser: UserType = {
  id: '1',
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg"
}