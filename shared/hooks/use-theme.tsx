import { create } from 'zustand';

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export const useTheme = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    if (typeof window === 'undefined') return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
}));