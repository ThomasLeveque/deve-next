import { NextPage } from 'next';
import React from 'react';

import Button from '@components/elements/button';
import Layout from '@components/layout';

import { useLinks } from '@libs/link/queries';

const Home: NextPage = () => {
  const { data, fetchNextPage, hasNextPage } = useLinks();
  console.log(data);
  return (
    <Layout>
      <h1 className="text-5xl text-center mb-10">Best react lib for mobile animation</h1>
      <Button text="Fetch more" disabled={!hasNextPage} onClick={fetchNextPage} />
    </Layout>
  );
};

export default Home;
