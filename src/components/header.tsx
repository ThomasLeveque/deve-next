import { LogoutIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/outline';
import { useMediaQuery } from '@hooks/use-media-query';
import { useAddLinkModalOpen, useAuthModalOpen } from '@store/modals.store';
import { useProfile } from '@store/profile.store';
import { supabase } from '@utils/init-supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import Avatar from './elements/avatar';
import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const Header: React.FC = React.memo(() => {
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
        onClick: () => supabase.auth.signOut(),
        icon: <LogoutIcon />,
      },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex h-header items-center justify-between px-5 xl:container xl:mx-auto">
        <Link href="/">
          <a className="with-ring group font-poppins-bold text-3xl hover:text-secondary">
            <span className="lg:group-hover:hidden">DN</span>
            <span className="hidden lg:group-hover:block">Deve-Next</span>
          </a>
        </Link>
        <div className="grid auto-cols-max grid-flow-col items-center gap-5">
          {/* <a
            href="https://chrome.google.com/webstore/detail/deve-next/oihbbilgakjdkeplfkgibndcnhpaphed"
            rel="noreferrer"
            className="hidden items-center text-sm hover:underline focus:underline lg:flex"
            target="_blank"
          >
            Get the chrome extension <ExternalLinkIcon className="ml-1 w-4" />
          </a> */}

          <Button
            theme="secondary"
            text={isSmallScreen ? 'Add link' : undefined}
            icon={<PlusIcon />}
            onClick={() => (profile ? setAddLinkModalOpen(true) : setAuthModalOpen(true))}
          />

          {profile ? (
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
