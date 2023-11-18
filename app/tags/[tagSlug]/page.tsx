import LinkCard from '@/components/LinkCard';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { PAGE_PARAM, pageParser } from '@/lib/constants';
import { fetchLinksByTagSlug } from '@/lib/queries/fetch-links-by-tag-slug';
import { fetchProfile } from '@/lib/queries/fetch-profile';
import { fetchTagBySlug } from '@/lib/queries/fetch-tag-by-slug';
import { fetchTags } from '@/lib/queries/fetch-tags';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type TagPageProps = {
  searchParams: { [PAGE_PARAM]?: string | string[] };
  params: { tagSlug?: string | string[] };
};

export default async function TagPage({ params: { tagSlug }, searchParams }: TagPageProps) {
  if (Array.isArray(tagSlug) || !tagSlug) {
    notFound();
  }

  const profile = await fetchProfile();
  const page = pageParser.parseServerSide(searchParams.page);

  const tag = await fetchTagBySlug(tagSlug);

  if (!tag) {
    notFound();
  }

  const [{ tagLinks, totalPages }, tags] = await Promise.all([fetchLinksByTagSlug(tagSlug, page), fetchTags()]);

  return (
    <section className="my-8">
      {tag && (
        <h1 className="mb-8 flex items-center gap-3 text-center text-4xl font-bold sm:text-left">
          Tag: <Badge>{`${tag.name} (${tag.links.length})`}</Badge>
        </h1>
      )}
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {tagLinks?.map((link) => <LinkCard key={link.id} link={link} profile={profile} tags={tags} />)}
      </ul>
      {totalPages && (
        <div className="flex justify-center">{<Pagination className="mt-8" totalPages={totalPages} />}</div>
      )}
    </section>
  );
}

export async function generateMetadata({ params: { tagSlug } }: TagPageProps): Promise<Metadata> {
  if (Array.isArray(tagSlug) || !tagSlug) {
    notFound();
  }

  const tag = await fetchTagBySlug(tagSlug);

  if (!tag) {
    notFound();
  }

  return { title: tag.name };
}
