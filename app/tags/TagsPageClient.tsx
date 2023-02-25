'use client';

import SpinnerIcon from '@components/icons/spinner-icon';
import TagItem from '@components/tag/tag-item';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { useTags } from '@data/tag/use-tags';
import { singleToArray } from '@utils/single-to-array';
import { useRouter } from 'next/navigation';

export default function TagsPageClient() {
  const router = useRouter();
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
                <TagItem
                  onClick={() => router.push(`/tags/${tag.slug}`)}
                  size="large"
                  text={`${tag.name} (${tag.linksCount})`}
                  isColored
                />
              </li>
            ))}
        </TagListWrapper>
      ) : (
        <SpinnerIcon className="m-auto mt-14 w-10" />
      )}
    </section>
  );
}
