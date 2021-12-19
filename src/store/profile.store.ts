import { atom, SetStateAction, useAtom } from 'jotai';

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: number;
  updatedAt: number;
}

const profileAtom = atom<Profile | null>(null);

export const useProfile = (): [Profile | null, (update: SetStateAction<Profile | null>) => void] =>
  useAtom(profileAtom);
