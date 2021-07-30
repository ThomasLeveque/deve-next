import { format } from 'date-fns';
import React from 'react';

import Avatar from '@components/elements/avatar';
import Button from '@components/elements/button';
import ToggleSwitch from '@components/elements/toggle-switch';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import Protected from '@components/protected';

import { useAuth } from '@hooks/auth/useAuth';
import { queryKeys } from '@hooks/link/query-keys';
import { useUserLinks } from '@hooks/link/use-user-links';

import { Page } from './_app';

const Account: Page = () => {
  const { user } = useAuth();

  const {
    data: userLinks,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserLinks(user?.id);

  return (
    <Protected>
      <div className="grid grid-cols-[250px,1fr] gap-9">
        {user && (
          <>
            <aside className="-mx-5 px-5 content-screen-height sticky top-header py-8 overflow-y-auto">
              <Avatar className="mb-6 -ml-1" size={85} />
              <ul className="space-y-5">
                <li>
                  <h3 className="text-[10px] font-poppins-bold uppercase mb-1">Username :</h3>
                  <h2 className="text-sm">{user.displayName}</h2>
                </li>
                <li>
                  <h3 className="text-[10px] font-poppins-bold uppercase mb-1">Email :</h3>
                  <h2 className="text-sm">{user.email}</h2>
                </li>
                <li>
                  <h3 className="text-[10px] font-poppins-bold uppercase mb-2">Admin status :</h3>
                  <ToggleSwitch disabled={true} checked={user.isAdmin} />
                </li>
                <li>
                  <h3 className="text-[10px] font-poppins-bold uppercase mb-1">Created at :</h3>
                  <h2 className="text-sm">{format(user.createdAt, 'MMMM d yyyy')}</h2>
                </li>
                <li>
                  <h3 className="text-[10px] font-poppins-bold uppercase mb-1">
                    Last updated at :
                  </h3>
                  <h2 className="text-sm">{format(user.updatedAt, 'MMMM d yyyy')}</h2>
                </li>
              </ul>
            </aside>
            {!userLinks ? (
              <SpinnerIcon className="w-10 m-auto mt-14" />
            ) : (
              <section className="my-8">
                <h1 className="text-4xl mb-8 font-poppins-bold text-center">All your links</h1>
                <ul className="grid grid-cols-2 gap-5">
                  {userLinks?.pages?.map((page) =>
                    page?.data.map((link) => (
                      <LinkItem
                        isProfilLink
                        key={link.id}
                        link={link}
                        linksQueryKey={queryKeys.userLinks(user.id as string)}
                      />
                    ))
                  )}
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
            )}
          </>
        )}
      </div>
    </Protected>
  );
};

Account.title = 'Account - Deve-next';

export default Account;
