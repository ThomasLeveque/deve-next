import { NextPage } from 'next';
import React from 'react';

import Layout from '@components/layout';
import Redirect from '@components/redirect';

import { useAuth } from '@hooks/useAuth';

const Home: NextPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="h-[4000px]">
        <h1 className="text-5xl text-center mb-10">Best react lib for mobile animation</h1>
      </div>
    </Layout>
  );
};

export default Home;
