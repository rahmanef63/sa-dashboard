import { Frame, PieChart, Map } from 'lucide-react'
import { MenuItem } from 'shared/types/navigation-types'

export const navProjectsConfig: MenuItem[] = [
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
]
