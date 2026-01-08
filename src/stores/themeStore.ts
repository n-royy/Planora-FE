import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',

      setMode: (mode: ThemeMode) => set({ mode }),

      toggleMode: () => {
        const currentMode = get().mode;
        const newMode =
          currentMode === 'light'
            ? 'light'
            : currentMode === 'dark'
              ? 'dark'
              : 'light';
        set({ mode: newMode });
      },
    }),
    {
      name: 'theme-storage', // name of the item in storage
    }
  )
);
