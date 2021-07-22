import { LogoutIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/outline';
import { ModalsStore, useModalsStore } from '@store/modals.store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { useAuth } from '@hooks/auth/useAuth';

import Avatar from './elements/avatar';
import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;
const toggleAddLinkModalSelector = (state: ModalsStore) => state.toggleAddLinkModal;

const Header: React.FC = () => {
  const { signOut, user, userLoaded } = useAuth();

  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);
  const toggleAddLinkModal = useModalsStore(toggleAddLinkModalSelector);

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
    <header className="xl:container xl:mx-auto h-header px-5 flex justify-between items-center sticky top-0 bg-white z-30">
      <Link href="/">
        <a className="font-poppins-bold text-2xl with-ring">Deve-next</a>
      </Link>
      <div className="grid grid-flow-col auto-cols-max items-center gap-4">
        <Button
          theme="secondary"
          text="Add link"
          icon={<PlusIcon />}
          onClick={user ? toggleAddLinkModal : toggleAuthModal}
        />
        {user ? (
          <MenuDropdown customButton={<Avatar />} items={userDropdownItems} />
        ) : (
          <Button theme="primary" text="Login" onClick={toggleAuthModal} />
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
