import TagPageClient from '@/app/tags/[tagSlug]/page.client';
import { getTagBySlug } from '@/data/tag/get-tag-by-slug';
import { fetchProfile } from '@/lib/supabase/queries/fetch-profile';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { tagSlug: string } }): Promise<Metadata> {
  const tag = await getTagBySlug(params.tagSlug);

  return { title: tag?.name };
}

export default async function TagPage({ params: { tagSlug } }: { params: { tagSlug: string } }) {
  const tag = await getTagBySlug(tagSlug);
  const profile = await fetchProfile();

  if (!tag) {
    notFound();
  }

  return <TagPageClient tag={tag} profile={profile} />;
}
