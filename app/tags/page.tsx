import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { TagListWrapper } from '@/components/TagListWrapper';
import { Button } from '@/components/ui/button';
import { fetchTags } from '@/lib/queries/fetch-tags';
import Link from 'next/link';

export default async function TagsPage() {
  const tags = await fetchTags();

  return (
    <section className="my-8">
      <h1 className="mb-8 text-center text-4xl font-bold sm:text-left">Tags</h1>
      {tags && tags.length > 0 ? (
        <TagListWrapper className="mb-4">
          {tags
            .filter((tag) => tag.links.length > 0)
            .map((tag) => (
              <li key={tag.id}>
                <Button asChild>
                  <Link href={`/tags/${tag.slug}`}>{`${tag.name} (${tag.links.length})`}</Link>
                </Button>
              </li>
            ))}
        </TagListWrapper>
      ) : (
        <SpinnerIcon size={40} className="m-auto mt-14" />
      )}
    </section>
  );
}
