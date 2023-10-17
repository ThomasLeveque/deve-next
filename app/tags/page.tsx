'use client';

import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { TagListWrapper } from '@/components/TagListWrapper';
import { Button } from '@/components/ui/Button';
import { useTags } from '@/data/tag/use-tags';
import { useRouter } from 'next/navigation';

export default function TagsPage() {
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
        <SpinnerIcon size={40} className="m-auto mt-14" />
      )}
    </section>
  );
}
