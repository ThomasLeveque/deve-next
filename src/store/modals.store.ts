import { Link } from '@models/link';
import { Nullable } from '@utils/shared-types';
import { atom, SetStateAction, useAtom } from 'jotai';

const authModalOpenAtom = atom(false);
export const useAuthModalOpen = (): [boolean, (update: SetStateAction<boolean>) => void] => useAtom(authModalOpenAtom);

const addLinkModalOpenAtom = atom(false);
export const useAddLinkModalOpen = (): [boolean, (update: SetStateAction<boolean>) => void] =>
  useAtom(addLinkModalOpenAtom);

const linkToCommentModalAtom = atom<Nullable<Link>>(null);
export const useLinkToCommentModal = (): [Nullable<Link>, (update: SetStateAction<Nullable<Link>>) => void] =>
  useAtom(linkToCommentModalAtom);

const linkToUpdateModalAtom = atom<Nullable<Link>>(null);
export const useLinkToUpdateModal = (): [Nullable<Link>, (update: SetStateAction<Nullable<Link>>) => void] =>
  useAtom(linkToUpdateModalAtom);

const linkToRemoveModalAtom = atom<Nullable<Link>>(null);
export const useLinkToRemoveModal = (): [Nullable<Link>, (update: SetStateAction<Nullable<Link>>) => void] =>
  useAtom(linkToRemoveModalAtom);
