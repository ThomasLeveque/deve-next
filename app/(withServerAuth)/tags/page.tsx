'use client';

import SpinnerIcon from '@components/icons/spinner-icon';
import TagItem from '@components/tag/tag-item';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { useTags } from '@data/tag/use-tags';
import { singleToArray } from '@utils/single-to-array';
import Link from 'next/link';

export default function Tags() {
  const { data: tags } = useTags();

  return (
    <section className="my-8">
      <h1 className="mb-8 text-center text-4xl font-bold sm:text-left">Tags</h1>
      {tags && tags.length > 0 ? (
        <TagListWrapper className="mb-4">
          {tags
            .filter((tag) => singleToArray(tag.links).length > 0)
            .map((tag) => (
              <li key={tag.id}>
                <Link href={`/tags/${tag.slug}`}>
                  <TagItem size="large" text={`${tag.name} (${singleToArray(tag.links).length ?? 0})`} isColored />
                </Link>
              </li>
            ))}
        </TagListWrapper>
      ) : (
        <SpinnerIcon className="m-auto mt-14 w-10" />
      )}
    </section>
  );
}
