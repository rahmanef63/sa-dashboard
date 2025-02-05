import { create } from 'zustand';
import { type GroupLabel, type MenuItem, type SubMenuItem } from '@/slices/sidebar/menu/types/';

export type DialogType = 'group' | 'menuItem' | 'subMenuItem';

interface DialogItem {
  type: DialogType;
  item?: GroupLabel | MenuItem | SubMenuItem;
}

interface NavMainDialogState {
  isOpen: boolean;
  dialogType: DialogType | null;
  dialogState: DialogItem | null;
  setIsOpen: (isOpen: boolean) => void;
  setDialogType: (type: DialogType | null) => void;
  setDialogState: (state: DialogItem | null) => void;
}

const useNavMainDialogStore = create<NavMainDialogState>((set) => ({
  isOpen: false,
  dialogType: null,
  dialogState: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setDialogType: (type) => set({ dialogType: type }),
  setDialogState: (state) => set({ dialogState: state }),
}));

export const useNavMainDialog = () => {
  const { isOpen, dialogType, dialogState, setIsOpen, setDialogType, setDialogState } = useNavMainDialogStore();
  
  return {
    isOpen,
    dialogType,
    dialogState,
    openDialog: (type: DialogType, item?: GroupLabel | MenuItem | SubMenuItem) => {
      setDialogType(type);
      setDialogState(item ? { type, item } : null);
      setIsOpen(true);
    },
    closeDialog: () => {
      setIsOpen(false);
      setDialogType(null);
      setDialogState(null);
    }
  };
}
