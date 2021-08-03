import create from 'zustand';

export interface AppConfigStore {
  tagsSidebarOpen: boolean;
  setTagsSidebarOpen: (open: boolean) => void;
}

export const useAppConfigStore = create<AppConfigStore>((set) => ({
  tagsSidebarOpen: false,
  setTagsSidebarOpen: (open) => set({ tagsSidebarOpen: open }),
}));
