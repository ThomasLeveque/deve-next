import { User as AuthUser } from '@firebase/auth-types';

import { db } from '@libs/firebase';
import { Document } from '@libs/types';

import { AdditionalUserData, User } from '@data-types/user.type';

import { dataToDocument } from '@utils/format-document';
import { formatUser } from '@utils/format-user';

export const createUser = async (
  userId: string,
  authUser: AuthUser,
  additionnalData?: AdditionalUserData
): Promise<void> => {
  const userRef = db.collection('users').doc(userId);
  const newUser = formatUser(authUser, additionnalData);
  return userRef.set(newUser);
};

export const getUser = async (userId: string): Promise<Document<User>> => {
  const userRef = db.doc(`users/${userId}`);
  const doc = await userRef.get();
  return dataToDocument<User>(doc);
};
