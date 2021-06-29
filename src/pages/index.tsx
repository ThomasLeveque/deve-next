import {
  ChevronDownIcon,
  FireIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/outline';
import { NextPage } from 'next';
import React, { useMemo } from 'react';

import Button from '@components/elements/button';
import MenuDropdown, { MenuDropdownItemProps } from '@components/elements/menu-dropdown';
import Layout from '@components/layout';
import LinkItem from '@components/link-item';

import { useLinks } from '@libs/link/queries';

const Home: NextPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useLinks();

  const orderLinksDropdownItems: Record<string, MenuDropdownItemProps> = useMemo(
    () => ({
      newest: {
        text: 'Most recent',
        onClick: () => null,
        icon: <SortDescendingIcon />,
      },
      oldest: {
        text: 'Oldest',
        onClick: () => null,
        icon: <SortAscendingIcon />,
      },
      liked: {
        text: 'Most liked',
        onClick: () => null,
        icon: <FireIcon />,
      },
    }),
    []
  );

  return (
    <Layout>
      <MenuDropdown
        items={Object.values(orderLinksDropdownItems)}
        dropdownPosition="left"
        className="mb-5"
        button={
          <Button
            className="!bg-gray-100 text-black"
            text="Most recent"
            icon={<ChevronDownIcon />}
          />
        }
      />
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
