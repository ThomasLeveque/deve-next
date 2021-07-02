import {
  ChevronDownIcon,
  FireIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/outline';
import { NextPage } from 'next';
import React from 'react';

import Button from '@components/elements/button';
import MenuDropdown, { MenuDropdownItemProps } from '@components/elements/menu-dropdown';
import Layout from '@components/layout';
import LinkItem from '@components/link-item';
import TagsFilterSidebar from '@components/tags-filter-sidebar';

import { useCategories } from '@libs/category/queries';
import { OrderLinksKey } from '@libs/link/db';
import { useLinks } from '@libs/link/queries';

import { useQueryString } from '@hooks/useQueryString';

const Home: NextPage = () => {
  const { updateOrderbyQuery, getOrderbyQuery, tagsQuery } = useQueryString();

  const orderLinksDropdownItems: Record<OrderLinksKey, MenuDropdownItemProps> = {
    newest: {
      text: 'Most recent',
      onClick: () => updateOrderbyQuery('newest'),
      icon: <SortDescendingIcon />,
    },
    oldest: {
      text: 'Oldest',
      onClick: () => updateOrderbyQuery('oldest'),
      icon: <SortAscendingIcon />,
    },
    liked: {
      text: 'Most liked',
      onClick: () => updateOrderbyQuery('liked'),
      icon: <FireIcon />,
    },
  };

  const orderbyQuery = getOrderbyQuery(Object.keys(orderLinksDropdownItems));

  const {
    data: links,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLinks(orderbyQuery, tagsQuery);
  const { data: tags } = useCategories();

  return (
    <Layout className="grid grid-cols-[1fr,250px] gap-9">
      <section className="my-8">
        <MenuDropdown
          items={Object.values(orderLinksDropdownItems)}
          dropdownPosition="left"
          className="mb-5"
          button={
            <Button
              className="!bg-gray-100 text-black"
              text={orderLinksDropdownItems[orderbyQuery].text}
              icon={<ChevronDownIcon />}
            />
          }
        />
        <ul className="grid grid-cols-2 gap-5">
          {links?.pages.map((page) =>
            page.data.map((link) => <LinkItem key={link.id} link={link} />)
          )}
        </ul>
        <Button
          text="Fetch more"
          className="mx-auto mt-8"
          disabled={!hasNextPage}
          loading={isFetchingNextPage}
          onClick={fetchNextPage}
        />
      </section>
      {tags ? (
        <TagsFilterSidebar
          tags={tags}
          className="tags-filter-sidebar-height sticky top-header py-8 overflow-y-auto"
        />
      ) : null}
    </Layout>
  );
};

export default Home;
