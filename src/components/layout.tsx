import { ModalsStore, useModalsStore } from '@store/modals.store';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import Header from '@components/header';

import { useAuth } from '@hooks/auth/useAuth';
import { usePrefetchCategories } from '@hooks/category/use-categories';

import AddCommentModal from './modals/add-comment-modal/add-comment-modal';
import AddLinkModal from './modals/add-link-modal/add-link-modal';
import LoginModal from './modals/login-modal/login-modal';
import RemoveLinkModal from './modals/remove-link-modal/remove-link-modal';
import UpdateLinkModal from './modals/update-link-modal/update-link-modal';

const authModalSelector = (state: ModalsStore) => state.authModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

const Layout: React.FC<{ className?: string }> = ({ className, children }) => {
  const { user } = useAuth();
  usePrefetchCategories();

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
      <AddLinkModal />
      <AddCommentModal />
      <UpdateLinkModal />
      <RemoveLinkModal />
    </>
  );
};

export default Layout;
