import { NextPage } from 'next';
import React from 'react';

import Redirect from '@components/redirect';
import SignIn from '@components/sign-in';
import SignInWithGoogle from '@components/sign-in-with-google';
import SignUp from '@components/sign-up';

import { useAuth } from '@hooks/useAuth';

const Home: NextPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <main>
      <h1 className="text-5xl text-center mb-10">Best react lib for mobile animation</h1>
      <SignUp />
      <SignIn />
      <SignInWithGoogle />
    </main>
  );
};

export default Home;
