import create from 'zustand';

import { Document } from '@libs/types';

import { Link } from '@data-types/link.type';

export interface ModalsStore {
  authModal: boolean;
  toggleAuthModal: () => void;
  addLinkModal: boolean;
  toggleAddLinkModal: () => void;
  linkToCommentModal: Document<Link> | null;
  setLinkToCommentModal: (link: Document<Link> | null) => void;
}

export const useModalsStore = create<ModalsStore>((set) => ({
  authModal: false,
  toggleAuthModal: () => set((state) => ({ authModal: !state.authModal })),
  addLinkModal: false,
  toggleAddLinkModal: () => set((state) => ({ addLinkModal: !state.addLinkModal })),
  linkToCommentModal: null,
  setLinkToCommentModal: (link) => set({ linkToCommentModal: link }),
}));
