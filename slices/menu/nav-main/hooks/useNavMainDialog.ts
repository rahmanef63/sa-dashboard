import { useState, useCallback } from 'react'
import { GroupLabel, MenuItem, SubMenuItem } from '../types'

type DialogType = 'group' | 'menuItem' | 'subMenuItem' | null
type DialogItem = GroupLabel | MenuItem | SubMenuItem | null

interface DialogState {
  type: DialogType
  item: DialogItem
}

export function useNavMainDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    item: null
  })

  const openDialog = useCallback((type: DialogType, item?: DialogItem) => {
    setDialogState({ type, item: item || null })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState({ type: null, item: null })
  }, [])

  const isDialogOpen = (type: DialogType) => dialogState.type === type

  return {
    dialogState,
    openDialog,
    closeDialog,
    isDialogOpen
  }
}
