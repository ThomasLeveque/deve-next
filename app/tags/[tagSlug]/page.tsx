import { LinkCardSkeletonList } from '@/components/LinkCardSkeletonList';
import { LinksList } from '@/components/LinksList';
import { Badge } from '@/components/ui/badge';
import { PAGE_PARAM, pageParser } from '@/lib/constants';
import { fetchLinksByTagSlug } from '@/lib/queries/fetch-links-by-tag-slug';
import { fetchProfile } from '@/lib/queries/fetch-profile';
import { fetchTagBySlug } from '@/lib/queries/fetch-tag-by-slug';
import { fetchTags } from '@/lib/queries/fetch-tags';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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

  return (
    <section className="my-8">
      {tag && (
        <h1 className="mb-8 flex items-center gap-3 text-center text-4xl font-bold sm:text-left">
          Tag: <Badge>{`${tag.name} (${tag.links.length})`}</Badge>
        </h1>
      )}
      <Suspense fallback={<LinkCardSkeletonList />}>
        <LinksList profile={profile} linksPromise={Promise.all([fetchLinksByTagSlug(tagSlug, page), fetchTags()])} />
      </Suspense>
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
