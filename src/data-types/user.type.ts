export interface User extends AdditionalUserData {
  email: string | null;
  photoURL: string | null;
  provider?: string;
  isAdmin: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AdditionalUserData {
  displayName: string | null;
}

export interface PostedByUser {
  id: string;
  displayName: string;
}

export interface VoteByUser {
  id: string;
  displayName: string;
}
