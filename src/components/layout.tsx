import { AppConfigStore, useAppConfigStore } from '@store/app-config.store';
import { ModalsStore, useModalsStore } from '@store/modals.store';
import classNames from 'classnames';
import Head from 'next/head';
import React, { useEffect } from 'react';

import Header from '@components/header';

import { useAuth } from '@hooks/auth/useAuth';
import { usePrefetchCategories } from '@hooks/category/use-categories';
import { useMediaQuery } from '@hooks/use-media-query';

import BackToTop from './back-to-top';
import AddCommentModal from './modals/add-comment-modal/add-comment-modal';
import AddLinkModal from './modals/add-link-modal/add-link-modal';
import LoginModal from './modals/login-modal/login-modal';
import RemoveLinkModal from './modals/remove-link-modal/remove-link-modal';
import UpdateLinkModal from './modals/update-link-modal/update-link-modal';

const authModalSelector = (state: ModalsStore) => state.authModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

interface LayoutProps {
  className?: string;
  title?: string;
  description?: string;
}

const setTagsSidebarOpenSelector = (state: AppConfigStore) => state.setTagsSidebarOpen;

const Layout: React.FC<LayoutProps> = ({ className, children, ...props }) => {
  const { user } = useAuth();
  const isMobileScreen = useMediaQuery('mobile');
  const setTagsSidebarOpen = useAppConfigStore(setTagsSidebarOpenSelector);

  usePrefetchCategories();

  const authModal = useModalsStore(authModalSelector);
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  useEffect(() => {
    if (user && authModal) {
      toggleAuthModal();
    }
  }, [user, authModal]);

  useEffect(() => {
    setTagsSidebarOpen(!isMobileScreen);
  }, [isMobileScreen]);

  const metaTitle = props.title ?? 'Deve-next';
  const metaDescription = props.description ?? 'The place to pratice technical watch';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta content={metaDescription} name="description" />
      </Head>
      <Header />
      <main className={classNames('xl:container xl:mx-auto px-5', className)}>{children}</main>
      <LoginModal />
      <AddLinkModal />
      <AddCommentModal />
      <UpdateLinkModal />
      <RemoveLinkModal />
      <BackToTop />
    </>
  );
};

export default Layout;
