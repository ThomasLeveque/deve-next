import { Profile } from '@models/profile';
import { atom, SetStateAction, useAtom } from 'jotai';

const profileAtom = atom<Profile | null>(null);

export const useProfile = (): [Profile | null, (update: SetStateAction<Profile | null>) => void] =>
  useAtom(profileAtom);
