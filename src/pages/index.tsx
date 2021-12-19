import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useTagsSidebarOpen } from '@store/app-config.store';
import classNames from 'classnames';
import React from 'react';

import Button from '@components/elements/button';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import OrderbyLinksDropdown from '@components/link/orderby-links-dropdown';
import TagsFilterSidebar from '@components/tag/tags-filter-sidebar';

import { queryKeys } from '@hooks/link/query-keys';
import { useLinks } from '@hooks/link/use-links';
import { useMediaQuery } from '@hooks/use-media-query';
import { useQueryString } from '@hooks/use-query-string';

import { Page } from './_app';

const Home: Page = () => {
  const [tagsSidebarOpen, setTagsSidebarOpen] = useTagsSidebarOpen();

  const isMobileScreen = useMediaQuery('mobile');

  const { orderbyQuery, tagsQuery, clearTagQuery } = useQueryString();

  const { data: links, fetchNextPage, hasNextPage, isFetchingNextPage } = useLinks();

  return (
    <div
      className={classNames({
        'grid grid-cols-[1fr,250px] gap-9': tagsSidebarOpen && !isMobileScreen,
      })}
    >
      {!links ? (
        <SpinnerIcon className="w-10 m-auto mt-14" />
      ) : (
        <section className="my-8">
          <div className="mb-5 flex justify-between space-x-4">
            <OrderbyLinksDropdown />
            <div className="flex space-x-4 flex-none">
              {tagsQuery.length > 0 && (
                <Button
                  theme="gray"
                  className="flex-none"
                  text={isMobileScreen ? 'Clear' : 'Clear tags'}
                  onClick={clearTagQuery}
                />
              )}
              <Button
                theme="secondary"
                className="flex-none"
                onClick={() => setTagsSidebarOpen(!tagsSidebarOpen)}
                icon={tagsSidebarOpen ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
              />
            </div>
          </div>
          <ul
            className={classNames('grid grid-cols-1 lg:grid-cols-2 gap-5', {
              'md:grid md:grid-cols-2 xl:grid-cols-3': !tagsSidebarOpen,
            })}
          >
            {links?.pages?.map((page) =>
              page?.data.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  linksQueryKey={queryKeys.links(orderbyQuery, tagsQuery)}
                />
              ))
            )}
          </ul>
          <Button
            theme="secondary"
            text={hasNextPage ? 'Load more' : 'No more links'}
            className="mx-auto mt-8"
            disabled={!hasNextPage}
            loading={isFetchingNextPage}
            onClick={fetchNextPage}
          />
        </section>
      )}
      {tagsSidebarOpen ? (
        <aside // -mx-5 px-5 to make ring visible because of overflow
          className={classNames(
            ' overflow-y-auto content-screen-height top-header',
            {
              'sticky px-5 -mx-5 py-8': !isMobileScreen,
            },
            { 'fixed right-0 top-0 bg-white px-8 pt-4 pb-8 shadow-lg': isMobileScreen }
          )}
        >
          {isMobileScreen && tagsSidebarOpen && (
            <div className="flex space-x-4 mb-5">
              <Button
                theme="secondary"
                className="flex-none"
                onClick={() => setTagsSidebarOpen(!tagsSidebarOpen)}
                icon={tagsSidebarOpen ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
              />
              {tagsQuery.length > 0 && (
                <Button
                  theme="gray"
                  className="flex-none"
                  text="Clear tags"
                  onClick={clearTagQuery}
                />
              )}
            </div>
          )}
          <TagsFilterSidebar />
        </aside>
      ) : null}
    </div>
  );
};

export default Home;
