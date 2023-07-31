'use client';

import SpinnerIcon from '@/components/icons/spinner-icon';
import TagListWrapper from '@/components/tag/tag-list-wrapper';
import { Button } from '@/components/ui/button';
import { useTags } from '@/data/tag/use-tags';
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
            .filter((tag) => tag.linksCount > 0)
            .map((tag) => (
              <li key={tag.id}>
                <Button onClick={() => router.push(`/tags/${tag.slug}`)}>{`${tag.name} (${tag.linksCount})`}</Button>
              </li>
            ))}
        </TagListWrapper>
      ) : (
        <SpinnerIcon className="m-auto mt-14 w-10" />
      )}
    </section>
  );
}