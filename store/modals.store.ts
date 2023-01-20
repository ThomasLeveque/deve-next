import { GetLinksReturn } from 'api/link/use-links';
import { atom, SetStateAction, useAtom } from 'jotai';
import { Nullable } from '~types/shared';

const authModalOpenAtom = atom(false);
export const useAuthModalOpen = (): [boolean, (update: SetStateAction<boolean>) => void] => useAtom(authModalOpenAtom);

const addLinkModalOpenAtom = atom(false);
export const useAddLinkModalOpen = (): [boolean, (update: SetStateAction<boolean>) => void] =>
  useAtom(addLinkModalOpenAtom);

const linkToCommentModalAtom = atom<Nullable<GetLinksReturn['data'][0]>>(null);
export const useLinkToCommentModal = (): [
  Nullable<GetLinksReturn['data'][0]>,
  (update: SetStateAction<Nullable<GetLinksReturn['data'][0]>>) => void
] => useAtom(linkToCommentModalAtom);

const linkToUpdateModalAtom = atom<Nullable<GetLinksReturn['data'][0]>>(null);
export const useLinkToUpdateModal = (): [
  Nullable<GetLinksReturn['data'][0]>,
  (update: SetStateAction<Nullable<GetLinksReturn['data'][0]>>) => void
] => useAtom(linkToUpdateModalAtom);

const linkToRemoveModalAtom = atom<Nullable<GetLinksReturn['data'][0]>>(null);
export const useLinkToRemoveModal = (): [
  Nullable<GetLinksReturn['data'][0]>,
  (update: SetStateAction<Nullable<GetLinksReturn['data'][0]>>) => void
] => useAtom(linkToRemoveModalAtom);
