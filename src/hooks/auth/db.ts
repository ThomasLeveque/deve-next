import { User as AuthUser } from '@firebase/auth-types';

import { AdditionalUserData, User } from '@data-types/user.type';

import { dataToDocument } from '@utils/format-document';
import { formatUser } from '@utils/format-user';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

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
