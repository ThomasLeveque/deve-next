import { NextPage } from 'next';
import React from 'react';

import { useAuth } from '@hooks/useAuth';

const Account: NextPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-5xl">Profil</h1>
      <h2 className="text-3xl">Name: {user?.displayName}</h2>
      <h3 className="text-xl">Email: {user?.email}</h3>
    </div>
  );
};

export default Account;
