import { ModalsStore, useModalsStore } from '@store/modals.store';
import Link from 'next/link';
import React from 'react';

import { useAuth } from '@hooks/useAuth';

import Button from './elements/button';

const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

const Header: React.FC = () => {
  const { signOut } = useAuth();
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="xl:container xl:mx-auto h-header px-5 flex justify-between items-center sticky top-0">
      <Link href="/">
        <a className="font-poppins-bold text-2xl focus:ring-4 focus:ring-primary">Deve-next</a>
      </Link>
      <Button text="Login" onClick={toggleAuthModal} />
    </header>
  );
};

export default Header;
