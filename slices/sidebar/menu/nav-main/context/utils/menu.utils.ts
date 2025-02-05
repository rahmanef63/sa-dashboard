import { MenuItem, MenuItem, NavMainData } from '@/slices/sidebar/menu/types/'

// Convert MenuItem to MenuItem
export const convertToMenuItem = (item: MenuItem): MenuItem => {
  // Ensure the item has a URL, if not provide a default
  const url = item.url || { href: '/' }
  return {
    ...item,
    url,
    // Convert children to items if they exist
    items: item.children?.map(child => ({
      ...child,
      url: child.url || { href: '/' },
      parentId: item.id
    }))
  }
}

export const saveMenuItems = (items: MenuItem[]) => {
  const convertedItems = items.map(convertToMenuItem)
  localStorage.setItem('userMenuItems', JSON.stringify(convertedItems))
}

export const saveNavData = (data: NavMainData) => {
  localStorage.setItem('navMainData', JSON.stringify(data))
}

export const loadMenuItems = (): MenuItem[] => {
  const storedItems = localStorage.getItem('userMenuItems')
  return storedItems ? JSON.parse(storedItems) : []
}

export const loadNavData = (): NavMainData | null => {
  const storedNavData = localStorage.getItem('navMainData')
  return storedNavData ? JSON.parse(storedNavData) : null
}

export const getDefaultGroup = () => ({
  label: { id: 'default', title: 'Default Group' },
  items: [] as MenuItem[]
})

export const removeDuplicateItems = (navData: NavMainData): NavMainData => {
  return {
    groups: navData.groups.map((group, groupIndex) => {
      const filteredItems = group.items.filter((item: MenuItem) => {
        const existsInPreviousGroup = navData.groups
          .slice(0, groupIndex)
          .some(prevGroup => 
            prevGroup.items.some(prevItem => prevItem.id === item.id)
          )
        return !existsInPreviousGroup
      })

      return {
        ...group,
        items: filteredItems.map((item: MenuItem) => ({
          ...item,
          groupId: group.label.id
        }))
      }
    })
  }
}
