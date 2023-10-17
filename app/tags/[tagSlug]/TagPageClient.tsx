'use client';

import SpinnerIcon from '@/components/icons/SpinnerIcon';
import LinkCard from '@/components/LinkCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTagLinks } from '@/data/link/use-links-by-tag';
import { GetTagBySlugReturn } from '@/data/tag/get-tag-by-slug';
import { singleToArray } from '@/lib/utils';

export default function TagPageClient({ tag }: { tag: NonNullable<GetTagBySlugReturn> }) {
  const { data: links, hasNextPage, isFetchingNextPage, fetchNextPage } = useTagLinks(tag.slug);

  const tagClient = singleToArray(links?.pages?.[0]?.data?.[0]?.tags).find((tag) => tag.slug === tag.slug);

  return (
    <section className="my-8">
      {tag && (
        <h1 className="mb-8 flex items-center gap-3 text-center text-4xl font-bold sm:text-left">
          Tag: <Badge>{`${tag.name} (${singleToArray(tagClient?.links).length ?? tag.linksCount})`}</Badge>
        </h1>
      )}
      {links ? (
        <>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {links?.pages?.map((page) => page?.data.map((link) => <LinkCard key={link.id} link={link} />))}
          </ul>
          <Button
            variant="secondary"
            className="mx-auto mt-8"
            disabled={!hasNextPage}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {hasNextPage ? 'Load more' : 'No more links'}
          </Button>
        </>
      ) : (
        <SpinnerIcon size={40} className="m-auto mt-14" />
      )}
    </section>
  );
}
