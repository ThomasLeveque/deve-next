import { ModalsStore, useModalsStore } from '@store/modals.store';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import Header from '@components/header';

import { useAuth } from '@hooks/useAuth';

import LoginModal from './modals/login-modal/login-modal';

const authModalSelector = (state: ModalsStore) => state.authModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

const Layout: React.FC<{ className?: string }> = ({ className, children }) => {
  const { user } = useAuth();

  const authModal = useModalsStore(authModalSelector);
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  useEffect(() => {
    if (user && authModal) {
      toggleAuthModal();
    }
  }, [user]);

  return (
    <>
      <Header />
      <main className={classNames('xl:container xl:mx-auto px-5', className)}>{children}</main>
      <LoginModal />
    </>
  );
};

export default Layout;
