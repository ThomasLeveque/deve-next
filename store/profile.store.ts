import { GetUserProfileReturn } from '@/data/auth/get-user-profile';
import { Nullable } from '@/types/shared';
import { atom, useAtom } from 'jotai';

const profileAtom = atom<Nullable<GetUserProfileReturn>>(null);
const profileLoadedAtom = atom<boolean>(false);

export function useProfile() {
  return useAtom(profileAtom);
}

export function useProfileLoaded() {
  return useAtom(profileLoadedAtom);
}
