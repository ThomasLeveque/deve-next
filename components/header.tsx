'use client';

import { ArrowLeftOnRectangleIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAddLinkModalOpen, useAuthModalOpen } from '@store/modals.store';
import { useProfile, useProfileLoaded } from '@store/profile.store';
import { supabase } from '@utils/supabase-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Avatar from './elements/avatar';
import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const Header = () => {
  const profile = useProfile()[0];
  const profileLoaded = useProfileLoaded()[0];

  const setAuthModalOpen = useAuthModalOpen()[1];
  const setAddLinkModalOpen = useAddLinkModalOpen()[1];

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
        icon: <ArrowLeftOnRectangleIcon />,
      },
    ],
    [router]
  );

  function openAddLink() {
    if (profile) {
      setAddLinkModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex h-header items-center justify-between px-5 xl:container xl:mx-auto">
        <div className="flex items-center space-x-5">
          <Link href="/" className="with-ring text-3xl font-bold hover:text-secondary">
            DN
          </Link>
          <Link href="/tags" className="with-ring px-1 font-bold hover:text-secondary hover:underline">
            Tags
          </Link>
        </div>
        <div className="grid auto-cols-max grid-flow-col items-center gap-5">
          <Button
            theme="secondary"
            text={'Add link'}
            icon={<PlusIcon />}
            className="hidden sm:flex"
            onClick={openAddLink}
          />
          <Button theme="secondary" className="flex sm:hidden" icon={<PlusIcon />} onClick={openAddLink} />

          {profile ? (
            <MenuDropdown customButton={<Avatar />} items={userDropdownItems} />
          ) : (
            <Button
              theme="primary"
              text="Login"
              onClick={() => {
                if (profileLoaded) {
                  setAuthModalOpen(true);
                }
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
