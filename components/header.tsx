'use client';

import { useSupabase } from '@components/SupabaseAuthProvider';
import { ArrowLeftOnRectangleIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { resolveHref, useCustomRouter } from '@hooks/useCustomRouter';
import { useAddLinkModalOpen, useAuthModalOpen } from '@store/modals.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Avatar from './elements/avatar';
import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const Header = () => {
  const pathname = usePathname();

  const { supabase, profile } = useSupabase();

  const setAuthModalOpen = useAuthModalOpen()[1];
  const setAddLinkModalOpen = useAddLinkModalOpen()[1];

  const router = useCustomRouter();

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
    []
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
          <Link href={resolveHref('/', pathname)} className="with-ring text-3xl font-bold hover:text-secondary">
            DN
          </Link>
          <Link
            href={resolveHref('/tags', pathname)}
            className="with-ring px-1 font-bold hover:text-secondary hover:underline"
          >
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
            <Button theme="primary" text="Login" onClick={() => setAuthModalOpen(true)} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
