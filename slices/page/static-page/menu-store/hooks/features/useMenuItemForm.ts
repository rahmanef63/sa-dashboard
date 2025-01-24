import { useState, useEffect } from 'react'
import { MenuItemWithIcon } from 'shared/icon-picker/types'

type UseMenuItemFormProps = {
  initialValues?: MenuItemWithIcon
  onSubmit: (item: MenuItemWithIcon) => void
}

export const useMenuItemForm = ({ initialValues, onSubmit }: UseMenuItemFormProps) => {
  const [item, setItem] = useState<MenuItemWithIcon>({
    id: '',
    title: '',
    url: { href: '' },
    icon: ''
  })

  useEffect(() => {
    if (initialValues) {
      setItem(initialValues)
    }
  }, [initialValues])

  const handleChange = (field: keyof MenuItemWithIcon, value: string) => {
    setItem((prev: MenuItemWithIcon) => ({
      ...prev,
      [field]: field === 'url' ? { href: value } : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof onSubmit === 'function') {
      onSubmit({ ...item, id: item.id || Date.now().toString() })
    } else {
      console.error('onSubmit is not a function', onSubmit)
    }
  }

  return {
    item,
    handleChange,
    handleSubmit
  }
}
