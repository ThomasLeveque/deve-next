import { useLinks } from '@api/link/use-links';
import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import OrderbyLinksDropdown from '@components/link/orderby-links-dropdown';
import TagsFilterSidebar from '@components/tag/tags-filter-sidebar';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useMediaQuery } from '@hooks/use-media-query';
import { useQueryString } from '@hooks/use-query-string';
import { useTagsSidebarOpen } from '@store/app-config.store';
import classNames from 'classnames';
import React, { useRef } from 'react';
import { Page } from './_app';

const Home: Page = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  const [tagsSidebarOpen, setTagsSidebarOpen] = useTagsSidebarOpen();
  const isMobileScreen = useMediaQuery('mobile');
  const { tagsQuery, clearTagQuery, searchQuery, setSearchQuery } = useQueryString();

  const { data: links, fetchNextPage, hasNextPage, isFetchingNextPage } = useLinks();
  console.log(links?.pages[0]?.data);
  return (
    <div
      className={classNames({
        'grid grid-cols-[1fr,250px] gap-9': tagsSidebarOpen && !isMobileScreen,
      })}
    >
      <section className="my-8">
        <TextInput
          ref={searchRef}
          placeholder="Search for a link..."
          type="search"
          id="search-link"
          wrapperClassName="mb-5"
          onChange={(event) => setSearchQuery(event.target.value)}
          value={searchQuery}
          clearValue={() => {
            setSearchQuery('');
            searchRef.current?.focus();
          }}
        />
        <div className="mb-5 flex justify-between space-x-4">
          <OrderbyLinksDropdown />
          <div className="flex flex-none space-x-4">
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
        {!links ? (
          <SpinnerIcon className="m-auto mt-14 w-10" />
        ) : (
          <>
            <ul
              className={classNames('grid grid-cols-1 gap-5 lg:grid-cols-2', {
                'md:grid md:grid-cols-2 xl:grid-cols-3 ': !tagsSidebarOpen,
              })}
            >
              {links?.pages?.map((page) => page?.data.map((link) => <LinkItem key={link.id} link={link} />))}
            </ul>
            <Button
              theme="secondary"
              text={hasNextPage ? 'Load more' : 'No more links'}
              className="mx-auto mt-8"
              disabled={!hasNextPage}
              loading={isFetchingNextPage}
              onClick={fetchNextPage}
            />
          </>
        )}
      </section>
      {tagsSidebarOpen ? (
        <aside // -mx-5 px-5 to make ring visible because of overflow
          className={classNames(
            ' content-screen-height top-header overflow-y-auto',
            {
              'sticky -mx-5 px-5 py-8': !isMobileScreen,
            },
            { 'fixed right-0 top-0 bg-white px-8 pt-4 pb-8 shadow-lg': isMobileScreen }
          )}
        >
          {isMobileScreen && tagsSidebarOpen && (
            <div className="mb-5 flex space-x-4">
              <Button
                theme="secondary"
                className="flex-none"
                onClick={() => setTagsSidebarOpen(!tagsSidebarOpen)}
                icon={tagsSidebarOpen ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
              />
              {tagsQuery.length > 0 && (
                <Button theme="gray" className="flex-none" text="Clear tags" onClick={clearTagQuery} />
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
