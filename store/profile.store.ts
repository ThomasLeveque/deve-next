import { GetUserProfileReturn } from '@api/auth/get-user-profile';
import { atom, SetStateAction, useAtom } from 'jotai';
import { Nullable } from '~types/shared';

const profileAtom = atom<Nullable<GetUserProfileReturn>>(null);
const profileLoadedAtom = atom<boolean>(false);

export const useProfile = (): [
  Nullable<GetUserProfileReturn>,
  (update: SetStateAction<Nullable<GetUserProfileReturn>>) => void
] => useAtom(profileAtom);

export const useProfileLoaded = (): [boolean, (update: SetStateAction<boolean>) => void] => useAtom(profileLoadedAtom);
