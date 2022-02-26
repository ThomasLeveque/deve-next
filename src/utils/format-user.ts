import { AdditionalUserData, User } from '@data-types/user.type';
import { User as AuthUser } from 'firebase/auth';

export const formatUser = (authUser: AuthUser, additionalData?: AdditionalUserData): User => ({
  email: authUser.email,
  photoURL: authUser.photoURL,
  provider: authUser.providerData[0]?.providerId,
  isAdmin: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  displayName: authUser.displayName,
  ...additionalData,
});
