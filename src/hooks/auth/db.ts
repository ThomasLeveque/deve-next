import { User as AuthUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { AdditionalUserData, User } from '@data-types/user.type';

import { dataToDocument } from '@utils/format-document';
import { formatUser } from '@utils/format-user';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';

export const createUser = async (
  userId: string,
  authUser: AuthUser,
  additionnalData?: AdditionalUserData
): Promise<void> => {
  const userRef = doc(db, dbKeys.user(userId));
  const newUser = formatUser(authUser, additionnalData);
  return setDoc(userRef, newUser);
};

export const getUser = async (userId: string): Promise<Document<User>> => {
  const userRef = doc(db, dbKeys.user(userId));
  const userDoc = await getDoc(userRef);
  return dataToDocument<User>(userDoc);
};
