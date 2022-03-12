import { atom, SetStateAction, useAtom } from 'jotai';

const tagsSidebarOpenAtom = atom(false);

export const useTagsSidebarOpen = (): [boolean, (update: SetStateAction<boolean>) => void] =>
  useAtom(tagsSidebarOpenAtom);
