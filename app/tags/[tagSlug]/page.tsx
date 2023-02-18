'use client';

import Button from '@components/elements/button';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import TagItem from '@components/tag/tag-item';
import { useTagLinks } from '@data/link/use-links-by-tag';
import { singleToArray } from '@utils/single-to-array';

export default function Tag({ params: { tagSlug } }: { params: { tagSlug: string } }) {
  const { data: links, hasNextPage, isFetchingNextPage, fetchNextPage } = useTagLinks(tagSlug);

  const tag = singleToArray(links?.pages?.[0]?.data?.[0]?.tags).find((tag) => tag.slug === tagSlug);

  return (
    <section className="my-8">
      {tag && (
        <h1 className="mb-8 flex items-center gap-3 text-center text-4xl font-bold sm:text-left">
          Tag: <TagItem size="large" text={`${tag.name} (${singleToArray(tag.links).length ?? 0})`} isColored />
        </h1>
      )}
      {links ? (
        <>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
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
      ) : (
        <SpinnerIcon className="m-auto mt-14 w-10" />
      )}
    </section>
  );
}
