'use client';

import SpinnerIcon from '@/components/icons/spinner-icon';
import LinkItem from '@/components/link/link-item';
import { Button } from '@/components/ui/button';
import { useUserLinks } from '@/data/link/use-user-links';
import { useProfile } from '@/store/profile.store';

export default function ProfilPageClient() {
  const profile = useProfile()[0];

  const { data: userLinks, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserLinks(profile?.id);

  return !userLinks ? (
    <SpinnerIcon size={40} className="m-auto my-8 sm:mt-14 " />
  ) : (
    <section className="mb-8 sm:mt-8">
      <h1 className="mb-8 text-center text-4xl font-bold sm:text-left">All your links</h1>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {userLinks?.pages?.map((page) => page?.data.map((link) => <LinkItem isProfilLink key={link.id} link={link} />))}
      </ul>
      <Button variant="secondary" className="mx-auto mt-8" disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        {hasNextPage ? 'Load more' : 'No more links'}
      </Button>
    </section>
  );
}
