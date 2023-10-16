'use client';

import TextInput from '@/components/elements/text-input';
import SpinnerIcon from '@/components/icons/spinner-icon';
import LinkItem from '@/components/link/link-item';
import OrderbyLinksDropdown from '@/components/link/orderby-links-dropdown';
import { Button } from '@/components/ui/button';
import { useLinks } from '@/data/link/use-links';
import { useQueryString } from '@/hooks/use-query-string';
import { useRef } from 'react';

export default function RootClient() {
  const searchRef = useRef<HTMLInputElement>(null);

  const { searchQuery, setSearchQuery } = useQueryString();

  const { data: links, fetchNextPage, hasNextPage, isFetchingNextPage } = useLinks();

  return (
    <section className="my-8">
      <div className="mb-5 flex space-x-2">
        <OrderbyLinksDropdown className="flex-none" />
        <TextInput
          ref={searchRef}
          placeholder="Search for a link..."
          type="search"
          wrapperClassName="w-full"
          id="search-link"
          onChange={(event) => setSearchQuery(event.target.value)}
          value={searchQuery}
          clearValue={() => {
            setSearchQuery('');
            searchRef.current?.focus();
          }}
        />
      </div>
      {!links ? (
        <SpinnerIcon size={40} className="m-auto mt-14" />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {links?.pages?.map((page) => page?.data.map((link) => <LinkItem key={link.id} link={link} />))}
          </ul>
          <Button
            variant={'secondary'}
            className="mx-auto mt-8"
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            {hasNextPage ? 'Load more' : 'No more links'}
          </Button>
        </>
      )}
    </section>
  );
}
