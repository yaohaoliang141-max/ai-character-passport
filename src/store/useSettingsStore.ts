import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string;
  baseUrl: string;
  model: string;
  setSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o',
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'script-architect-settings',
    }
  )
);
