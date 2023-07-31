import { getTagBySlug } from '@/data/tag/get-tag-by-slug';
import TagPageClient from 'app/tags/[tagSlug]/TagPageClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { tagSlug: string } }): Promise<Metadata> {
  const tag = await getTagBySlug(params.tagSlug);

  return { title: tag?.name };
}

export default async function Tag({ params: { tagSlug } }: { params: { tagSlug: string } }) {
  const tag = await getTagBySlug(tagSlug);

  if (!tag) {
    notFound();
  }

  return <TagPageClient tag={tag} />;
}
