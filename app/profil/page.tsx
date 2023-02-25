'use client';

import Button from '@components/elements/button';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import { useUserLinks } from '@data/link/use-user-links';
import { useProfile } from '@store/profile.store';

export default function Profil() {
  const profile = useProfile()[0];

  const { data: userLinks, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserLinks(profile?.id);

  return !userLinks ? (
    <SpinnerIcon className="m-auto my-8 w-10 sm:mt-14 " />
  ) : (
    <section className="mb-8 sm:mt-8">
      <h1 className="mb-8 text-center text-4xl font-bold sm:text-left">All your links</h1>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {userLinks?.pages?.map((page) => page?.data.map((link) => <LinkItem isProfilLink key={link.id} link={link} />))}
      </ul>
      <Button
        theme="secondary"
        text={hasNextPage ? 'Load more' : 'No more links'}
        className="mx-auto mt-8"
        disabled={!hasNextPage}
        loading={isFetchingNextPage}
        onClick={fetchNextPage}
      />
    </section>
  );
}
