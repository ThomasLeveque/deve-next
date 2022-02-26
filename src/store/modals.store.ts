import { Link } from '@data-types/link.type';
import { Document } from '@utils/shared-types';
import { atom, SetStateAction, useAtom } from 'jotai';

const authModalOpenAtom = atom(false);
export const useAuthModalOpen = (): [boolean, (update: SetStateAction<boolean>) => void] => useAtom(authModalOpenAtom);

const addLinkModalOpenAtom = atom(false);
export const useAddLinkModalOpen = (): [boolean, (update: SetStateAction<boolean>) => void] =>
  useAtom(addLinkModalOpenAtom);

const linkToCommentModalAtom = atom<Document<Link> | null>(null);
export const useLinkToCommentModal = (): [
  Document<Link> | null,
  (update: SetStateAction<Document<Link> | null>) => void
] => useAtom(linkToCommentModalAtom);

const linkToUpdateModalAtom = atom<Document<Link> | null>(null);
export const useLinkToUpdateModal = (): [
  Document<Link> | null,
  (update: SetStateAction<Document<Link> | null>) => void
] => useAtom(linkToUpdateModalAtom);

const linkToRemoveModalAtom = atom<Document<Link> | null>(null);
export const useLinkToRemoveModal = (): [
  Document<Link> | null,
  (update: SetStateAction<Document<Link> | null>) => void
] => useAtom(linkToRemoveModalAtom);
