import { Frame, PieChart, Map, Database } from 'lucide-react'
import { MenuItem } from '@/slices/sidebar/menu/types/'

export const navProjectsConfig = {
  projects: [
    {
      id: 'project-1',
      title: 'Design Engineering',
      url: { href: '#' },
      icon: Frame,
    },
    {
      id: 'project-2',
      title: 'Sales & Marketing',
      url: { href: '#' },
      icon: PieChart,
    },
    {
      id: 'project-3',
      title: 'Travel',
      url: { href: '#' },
      icon: Map,
    },
    {
      id: 'project-4',
      title: 'Database',
      url: { href: '/dashboard/database-manager' },
      icon: Database,
    }
  ] as MenuItem[]
}
