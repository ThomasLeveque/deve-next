import { ArrowLeftOnRectangleIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useMediaQuery } from '@hooks/use-media-query';
import { resolveHref, useCustomRouter } from '@hooks/useCustomRouter';
import { useAddLinkModalOpen, useAuthModalOpen } from '@store/modals.store';
import { useProfile } from '@store/profile.store';
import { supabase } from '@utils/init-supabase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import Avatar from './elements/avatar';
import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const Header: React.FC = React.memo(() => {
  const profile = useProfile()[0];
  const pathname = usePathname();

  const setAuthModalOpen = useAuthModalOpen()[1];
  const setAddLinkModalOpen = useAddLinkModalOpen()[1];

  const isSmallScreen = useMediaQuery('sm');

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

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex h-header items-center justify-between px-5 xl:container xl:mx-auto">
        <div className="flex items-center space-x-5">
          <Link href={resolveHref('/', pathname)} className="with-ring font-poppins-bold text-3xl hover:text-secondary">
            DN
          </Link>
          <Link
            href={resolveHref('/tags', pathname)}
            className="with-ring px-1 font-poppins-bold hover:text-secondary hover:underline"
          >
            Tags
          </Link>
        </div>
        <div className="grid auto-cols-max grid-flow-col items-center gap-5">
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
