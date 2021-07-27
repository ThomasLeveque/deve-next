import create from 'zustand';

import { Link } from '@data-types/link.type';

import { Document } from '@utils/shared-types';

export interface ModalsStore {
  authModal: boolean;
  toggleAuthModal: () => void;
  addLinkModal: boolean;
  toggleAddLinkModal: () => void;
  linkToCommentModal: Document<Link> | null;
  setLinkToCommentModal: (link: Document<Link> | null) => void;
  linkToUpdateModal: Document<Link> | null;
  setLinkToUpdateModal: (link: Document<Link> | null) => void;
}

export const useModalsStore = create<ModalsStore>((set) => ({
  authModal: false,
  toggleAuthModal: () => set((state) => ({ authModal: !state.authModal })),
  addLinkModal: false,
  toggleAddLinkModal: () => set((state) => ({ addLinkModal: !state.addLinkModal })),
  linkToCommentModal: null,
  setLinkToCommentModal: (link) => set({ linkToCommentModal: link }),
  linkToUpdateModal: null,
  setLinkToUpdateModal: (link) => set({ linkToUpdateModal: link }),
}));
