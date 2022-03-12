import { Profile } from '@models/profile';
import { Nullable } from '@utils/shared-types';
import { atom, SetStateAction, useAtom } from 'jotai';

const profileAtom = atom<Nullable<Profile>>(null);
const profileLoadedAtom = atom<boolean>(false);

export const useProfile = (): [Nullable<Profile>, (update: SetStateAction<Nullable<Profile>>) => void] =>
  useAtom(profileAtom);

export const useProfileLoaded = (): [boolean, (update: SetStateAction<boolean>) => void] => useAtom(profileLoadedAtom);
