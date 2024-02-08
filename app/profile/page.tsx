import { LinkCardSkeletonList } from '@/components/LinkCardSkeletonList';
import { LinksList } from '@/components/LinksList';
import { PAGE_PARAM, pageParser } from '@/lib/constants';
import { fetchLinksByUserId } from '@/lib/queries/fetch-links-by-user-id';
import { fetchProfile } from '@/lib/queries/fetch-profile';
import { fetchTags } from '@/lib/queries/fetch-tags';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata = {
  title: 'Account',
};

type ProfilePageProps = {
  searchParams: { [PAGE_PARAM]?: string | string[] };
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const profile = await fetchProfile();

  if (!profile) {
    redirect('/');
  }

  const page = pageParser.parseServerSide(searchParams.page);

  return (
    <section className="mb-8 sm:mt-8">
      <h1 className="mb-8 text-center text-4xl font-bold sm:text-left">All your links</h1>
      <Suspense fallback={<LinkCardSkeletonList />}>
        <LinksList profile={profile} linksPromise={Promise.all([fetchLinksByUserId(profile.id, page), fetchTags()])} />
      </Suspense>
    </section>
  );
}
