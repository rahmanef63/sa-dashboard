import { useState, useCallback } from 'react'
import { iconOptions } from '../utils'

export const useIconPicker = (initialValue: string = '') => {
  const [selectedIcon, setSelectedIcon] = useState(initialValue)

  const handleIconChange = useCallback((value: string) => {
    setSelectedIcon(value)
  }, [])

  return {
    selectedIcon,
    handleIconChange,
    iconOptions
  }
}

