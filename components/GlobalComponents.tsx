'use client';

import BackToTop from '@components/back-to-top';
import Toast from '@components/elements/toast';
import AddCommentModal from '@components/modals/add-comment-modal/add-comment-modal';
import AddLinkModal from '@components/modals/add-link-modal/add-link-modal';
import LoginModal from '@components/modals/login-modal/login-modal';
import RemoveLinkModal from '@components/modals/remove-link-modal/remove-link-modal';
import UpdateLinkModal from '@components/modals/update-link-modal/update-link-modal';
import { useAuthModalOpen } from '@store/modals.store';
import { useProfile } from '@store/profile.store';
import { usePrefetchTags } from 'api/tag/use-tags';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export function GlobalComponents() {
  const [profile] = useProfile();

  usePrefetchTags();

  const [authModalOpen, setAuthModalOpen] = useAuthModalOpen();

  useEffect(() => {
    if (profile && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [profile, authModalOpen, setAuthModalOpen]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      >
        {(t) => <Toast toast={t} />}
      </Toaster>
      <LoginModal />
      <AddLinkModal />
      <AddCommentModal />
      <UpdateLinkModal />
      <RemoveLinkModal />
      <BackToTop />
    </>
  );
}
