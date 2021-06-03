import { NextPage } from 'next';
import React from 'react';

import Layout from '@components/layout';

import { useAuth } from '@hooks/useAuth';

const Account: NextPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h1 className="text-5xl">Account</h1>
      <h2 className="text-3xl">Name: {user?.displayName}</h2>
      <h3 className="text-xl">Email: {user?.email}</h3>
    </Layout>
  );
};

export default Account;
