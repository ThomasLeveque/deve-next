import { useAuth } from '@api/auth/useAuth';
import { queryKeys } from '@api/old-link/query-keys';
import { useUserLinks } from '@api/old-link/use-user-links';
import Avatar from '@components/elements/avatar';
import Button from '@components/elements/button';
import ToggleSwitch from '@components/elements/toggle-switch';
import SpinnerIcon from '@components/icons/spinner-icon';
import LinkItem from '@components/link/link-item';
import Protected from '@components/protected';
import { format } from 'date-fns';
import React from 'react';
import { Page } from './_app';

const Account: Page = () => {
  const { user } = useAuth();

  const { data: userLinks, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserLinks(user?.id);

  return (
    <Protected>
      <div className="grid gap-9 sm:grid-cols-[250px,1fr]">
        {user && (
          <>
            <aside className="sm:content-screen-height -mx-5 px-5 pt-8 sm:sticky sm:top-header sm:overflow-y-auto sm:pb-8">
              <Avatar disabled className="mx-auto mb-6 sm:-ml-1" size={85} />
              <ul className="space-y-5 text-center sm:text-left">
                <li>
                  <h3 className="mb-1 font-poppins-bold text-[10px] uppercase">Username :</h3>
                  <h2 className="break-all text-sm">{user.displayName}</h2>
                </li>
                <li>
                  <h3 className="mb-1 font-poppins-bold text-[10px] uppercase">Email :</h3>
                  <h2 className="break-all text-sm">{user.email}</h2>
                </li>
                <li>
                  <h3 className="mb-2 font-poppins-bold text-[10px] uppercase">Admin status :</h3>
                  <ToggleSwitch className="mx-auto sm:mx-0" disabled={true} checked={user.isAdmin} />
                </li>
                <li>
                  <h3 className="mb-1 font-poppins-bold text-[10px] uppercase">Created at :</h3>
                  <h2 className="text-sm">{format(user.createdAt, 'MMMM d yyyy')}</h2>
                </li>
                <li>
                  <h3 className="mb-1 font-poppins-bold text-[10px] uppercase">Last updated at :</h3>
                  <h2 className="text-sm">{format(user.updatedAt, 'MMMM d yyyy')}</h2>
                </li>
              </ul>
            </aside>
            {!userLinks ? (
              <SpinnerIcon className="m-auto my-8 w-10 sm:mt-14 " />
            ) : (
              <section className="mb-8 sm:mt-8">
                <h1 className="mb-8 text-center font-poppins-bold text-4xl">All your links</h1>
                <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
