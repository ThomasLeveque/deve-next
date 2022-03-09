import { usePrefetchTags } from '@api/tag/use-tags';
import Header from '@components/header';
import { useMediaQuery } from '@hooks/use-media-query';
import { useTagsSidebarOpen } from '@store/app-config.store';
import { useAuthModalOpen } from '@store/modals.store';
import { useProfile } from '@store/profile.store';
import classNames from 'classnames';
import Head from 'next/head';
import React, { useEffect } from 'react';
import BackToTop from './back-to-top';
import AddCommentModal from './modals/add-comment-modal/add-comment-modal';
import AddLinkModal from './modals/add-link-modal/add-link-modal';
import LoginModal from './modals/login-modal/login-modal';
import RemoveLinkModal from './modals/remove-link-modal/remove-link-modal';
import UpdateLinkModal from './modals/update-link-modal/update-link-modal';

interface LayoutProps {
  className?: string;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ className, children, ...props }) => {
  const [profile] = useProfile();
  const isMobileScreen = useMediaQuery('mobile');
  const setTagsSidebarOpen = useTagsSidebarOpen()[1];

  usePrefetchTags();

  const [authModalOpen, setAuthModalOpen] = useAuthModalOpen();

  useEffect(() => {
    if (profile && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [profile, authModalOpen, setAuthModalOpen]);

  useEffect(() => {
    setTagsSidebarOpen(!isMobileScreen);
  }, [isMobileScreen, setTagsSidebarOpen]);

  const metaTitle = props.title ?? 'Deve-next';
  const metaDescription = props.description ?? 'The place to pratice technical watch';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta content={metaDescription} name="description" />
      </Head>
      <Header />
      <main className={classNames('px-5 xl:container xl:mx-auto', className)}>{children}</main>
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
