import { atom, SetStateAction, useAtom } from 'jotai';

import { Profile } from '@models/profile';

const profileAtom = atom<Profile | null>(null);

export const useProfile = (): [Profile | null, (update: SetStateAction<Profile | null>) => void] =>
  useAtom(profileAtom);
