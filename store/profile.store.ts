import { GetUserProfileReturn } from '@/data/auth/get-user-profile';
import { Nullable } from '@/types/shared';
import { atom, SetStateAction, useAtom } from 'jotai';

const profileAtom = atom<Nullable<GetUserProfileReturn>>(null);
const profileLoadedAtom = atom<boolean>(false);

export const useProfile = (): [
  Nullable<GetUserProfileReturn>,
  (update: SetStateAction<Nullable<GetUserProfileReturn>>) => void
] => useAtom(profileAtom);

export const useProfileLoaded = (): [boolean, (update: SetStateAction<boolean>) => void] => useAtom(profileLoadedAtom);
