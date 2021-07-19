import { NextPage } from 'next';
import React from 'react';

import Protected from '@components/protected';

import { useAuth } from '@hooks/auth/useAuth';

const Account: NextPage = () => {
  const { user } = useAuth();

  return (
    <Protected>
      <h1 className="text-5xl">Profil</h1>
      <h2 className="text-3xl">Name: {user?.displayName}</h2>
      <h3 className="text-xl">Email: {user?.email}</h3>
    </Protected>
  );
};

export default Account;
