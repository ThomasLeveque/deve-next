import { ExternalLinkIcon, LogoutIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/outline';
import { useAuthModalOpen, useAddLinkModalOpen } from '@store/modals.store';
import { useProfile } from '@store/profile.store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { useAuth } from '@hooks/auth/useAuth';
import { useMediaQuery } from '@hooks/use-media-query';

import { supabase } from '@utils/init-supabase';

import Avatar from './elements/avatar';
import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const Header: React.FC = React.memo(() => {
  const { signOut, user } = useAuth();

  const profile = useProfile()[0];

  const setAuthModalOpen = useAuthModalOpen()[1];
  const setAddLinkModalOpen = useAddLinkModalOpen()[1];

  const isSmallScreen = useMediaQuery('sm');

  const router = useRouter();

  const userDropdownItems: MenuDropdownItemProps[] = useMemo(
    () => [
      {
        text: 'Profil',
        onClick: () => router.push('/profil'),
        icon: <UserCircleIcon />,
      },
      {
        text: 'Logout',
        onClick: signOut,
        icon: <LogoutIcon />,
      },
    ],
    []
  );

  return (
    <header className="sticky top-0 bg-white z-30">
      <div className="xl:container xl:mx-auto h-header flex justify-between items-center px-5">
        <Link href="/">
          <a className="font-poppins-bold text-3xl with-ring group hover:text-secondary">
            <span className="lg:group-hover:hidden">DN</span>
            <span className="lg:group-hover:block hidden">Deve-Next</span>
          </a>
        </Link>
        <div className="grid grid-flow-col auto-cols-max items-center gap-5">
          <a
            href="https://chrome.google.com/webstore/detail/deve-next/oihbbilgakjdkeplfkgibndcnhpaphed"
            rel="noreferrer"
            className="hidden lg:flex items-center hover:underline focus:underline text-sm"
            target="_blank"
          >
            Get the chrome extension <ExternalLinkIcon className="ml-1 w-4" />
          </a>

          <Button
            theme="secondary"
            text={isSmallScreen ? 'Add link' : undefined}
            icon={<PlusIcon />}
            onClick={() => (user ? setAddLinkModalOpen(true) : setAuthModalOpen(true))}
          />

          {profile ? (
            <>
              <p>{profile.username}</p>
              <Button
                theme="secondary"
                text="SB logout"
                onClick={() => {
                  supabase.auth.signOut();
                }}
              />
            </>
          ) : (
            <>
              <Button
                theme="secondary"
                text="discord"
                onClick={() => {
                  supabase.auth.signIn({
                    provider: 'discord',
                  });
                }}
              />
              <Button
                theme="secondary"
                text="google"
                onClick={() => {
                  supabase.auth.signIn({
                    provider: 'google',
                  });
                }}
              />
              <Button
                theme="secondary"
                text="github"
                onClick={() => {
                  supabase.auth.signIn({
                    provider: 'github',
                  });
                }}
              />
            </>
          )}

          {user ? (
            <MenuDropdown customButton={<Avatar />} items={userDropdownItems} />
          ) : (
            <Button theme="primary" text="Login" onClick={() => setAuthModalOpen(true)} />
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
