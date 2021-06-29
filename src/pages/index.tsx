import { NextPage } from 'next';
import React from 'react';

import Button from '@components/elements/button';
import Layout from '@components/layout';
import LinkItem from '@components/link-item';

import { useLinks } from '@libs/link/queries';

const Home: NextPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useLinks();
  return (
    <Layout>
      <ul className="grid grid-cols-2 gap-5">
        {data?.pages.map((page) => page.data.map((link) => <LinkItem key={link.id} link={link} />))}
      </ul>
      <Button
        text="Fetch more"
        className="mx-auto mt-8"
        disabled={!hasNextPage}
        loading={isFetchingNextPage}
        onClick={fetchNextPage}
      />
    </Layout>
  );
};

export default Home;
