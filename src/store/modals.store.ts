import create from 'zustand';

export interface ModalsStore {
  authModal: boolean;
  toggleAuthModal: () => void;
  linkModal: boolean;
  toggleLinkModal: () => void;
  addLinkModal: boolean;
  toggleAddLinkModal: () => void;
}

export const useModalsStore = create<ModalsStore>((set) => ({
  authModal: false,
  toggleAuthModal: () => set((state) => ({ authModal: !state.authModal })),
  linkModal: false,
  toggleLinkModal: () => set((state) => ({ linkModal: !state.linkModal })),
  addLinkModal: false,
  toggleAddLinkModal: () => set((state) => ({ addLinkModal: !state.addLinkModal })),
}));
