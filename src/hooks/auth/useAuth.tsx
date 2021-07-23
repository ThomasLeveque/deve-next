import { User as AuthUser } from '@firebase/auth-types';
import React, { createContext, useContext, memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AdditionalUserData, User } from '@data-types/user.type';

import { formatError } from '@utils/format-string';
import firebase, { auth } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import { getUser, createUser } from './db';

type AuthContextType = {
  user: Document<User> | null;
  userLoaded: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    additionalData: AdditionalUserData
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
};

const authContext = createContext<AuthContextType>({
  user: null,
  userLoaded: false,
  signUpWithEmail: async () => undefined,
  signInWithEmail: async () => undefined,
  signInWithGoogle: async () => undefined,
  signInWithGithub: async () => undefined,
  signOut: async () => undefined,
});

export const useAuth = (): AuthContextType => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used in a component within a AuthProvider.');
  }
  return context;
};

const useProvideAuth = () => {
  const [user, setUser] = useState<Document<User> | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const handleUser = async (
    authUser: AuthUser | null,
    additionalData?: AdditionalUserData
  ): Promise<void> => {
    if (authUser) {
      let userData = await getUser(authUser.uid);

      if (!userData.exists) {
        await createUser(authUser.uid, authUser, additionalData);
        userData = await getUser(authUser.uid);
      }
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    additionalData: AdditionalUserData
  ): Promise<void> => {
    const { user: authUser } = await auth.createUserWithEmailAndPassword(email, password);
    return handleUser(authUser, { displayName: additionalData.displayName });
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    const { user: authUser } = await auth.signInWithEmailAndPassword(email, password);
    return handleUser(authUser);
  };

  const signInWithGoogle = async (): Promise<void> => {
    const { user: authUser } = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    return handleUser(authUser);
  };

  const signInWithGithub = async (): Promise<void> => {
    const { user: authUser } = await auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
    return handleUser(authUser);
  };

  const signOut = async (): Promise<void> => {
    await auth.signOut();
    return handleUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (authUser: AuthUser | null) => {
        try {
          await handleUser(authUser);
        } catch (err) {
          toast.error(formatError(err));
          console.error(err);
        }
        setUserLoaded(true);
        unsubscribe();
      },
      (err) => {
        toast.error(formatError<firebase.auth.Error>(err));
        console.error(err);
        setUserLoaded(true);
        unsubscribe();
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    userLoaded,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  };
};

const AuthProvider = memo(({ children }) => {
  const auth: AuthContextType = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
});

export default AuthProvider;
