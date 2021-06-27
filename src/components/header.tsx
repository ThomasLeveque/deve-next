import { CodeIcon, LogoutIcon } from '@heroicons/react/outline';
import { ModalsStore, useModalsStore } from '@store/modals.store';
import Link from 'next/link';
import React, { useMemo } from 'react';

import { useAuth } from '@hooks/useAuth';

import Button from './elements/button';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';

const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

const Header: React.FC = () => {
  const { signOut, user } = useAuth();
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  const userDropdownItems: MenuDropdownItemProps[] = useMemo(
    () => [
      {
        text: 'Logout',
        onClick: signOut,
        icon: <LogoutIcon />,
      },
    ],
    []
  );

  return (
    <header className="xl:container xl:mx-auto h-header px-5 flex justify-between items-center sticky top-0">
      <Link href="/">
        <a className="font-poppins-bold text-2xl with-ring">Deve-next</a>
      </Link>
      <div className="flex">
        {user ? (
          <MenuDropdown button={<Button text="Menu" />} items={userDropdownItems} />
        ) : (
          <Button text="Login" onClick={toggleAuthModal} />
        )}
      </div>
    </header>
  );
};

export default Header;
