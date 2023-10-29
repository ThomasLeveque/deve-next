'use client';

import LinkCard from '@/components/LinkCard';
import OrderbyLinksDropdown from '@/components/OrderbyLinksDropdown';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLinks } from '@/data/link/use-links';
import { useQueryString } from '@/hooks/use-query-string';
import { useRef } from 'react';

export default function HomePage() {
  const searchRef = useRef<HTMLInputElement>(null);

  const { searchQuery, setSearchQuery } = useQueryString();

  const { data: links, fetchNextPage, hasNextPage, isFetchingNextPage } = useLinks();

  return (
    <section className="my-8">
      <div className="mb-5 flex space-x-2">
        <OrderbyLinksDropdown className="flex-none" />
        <Input
          ref={searchRef}
          placeholder="Search for a link..."
          type="search"
          className="w-full"
          id="search-link"
          onChange={(event) => setSearchQuery(event.target.value)}
          value={searchQuery}
        />
      </div>
      {!links ? (
        <SpinnerIcon size={40} className="m-auto mt-14" />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {links?.pages?.map((page) => page?.data.map((link) => <LinkCard key={link.id} link={link} />))}
          </ul>
          <div className="flex justify-center">
            <Button
              variant="default"
              className="mt-8"
              disabled={!hasNextPage}
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            >
              {hasNextPage ? 'Load more' : 'No more links'}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
