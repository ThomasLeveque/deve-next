import LinkCard from '@/components/LinkCard';
import { Badge } from '@/components/ui/badge';
import { pageParser } from '@/lib/constants';
import { fetchLinksByTagSlug } from '@/lib/supabase/queries/fetch-links-by-tag-slug';
import { fetchProfile } from '@/lib/supabase/queries/fetch-profile';
import { fetchTagBySlug } from '@/lib/supabase/queries/fetch-tag-by-slug';
import { fetchTags } from '@/lib/supabase/queries/fetch-tags';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type TagPageProps = {
  searchParams: { page?: string | string[] };
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

  const [links, tags] = await Promise.all([fetchLinksByTagSlug(tagSlug, page), fetchTags()]);

  return (
    <section className="my-8">
      {tag && (
        <h1 className="mb-8 flex items-center gap-3 text-center text-4xl font-bold sm:text-left">
          Tag: <Badge>{`${tag.name} (${tag.links.length})`}</Badge>
        </h1>
      )}
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {links?.map((link) => <LinkCard key={link.id} link={link} profile={profile} tags={tags} />)}
      </ul>
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
