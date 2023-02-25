import { useAuthModalOpen } from '@store/modals.store';
import { useProfile } from '@store/profile.store';
import React, { useCallback, useEffect } from 'react';
import { Modal } from '../modal';
import SignInWithDiscordBtn from './sign-in-with-discord-btn';
import SignInWithGithubBtn from './sign-in-with-github-btn';
import SignInWithGoogleBtn from './sign-in-with-google-btn';

const LoginModal: React.FC = React.memo(() => {
  const [authModalOpen, setAuthModalOpen] = useAuthModalOpen();
  const profile = useProfile()[0];

  const closeModal = useCallback(() => {
    setAuthModalOpen(false);
  }, [setAuthModalOpen]);

  useEffect(() => {
    if (profile && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [profile, authModalOpen, setAuthModalOpen]);

  return (
    <Modal isOpen={authModalOpen} closeModal={closeModal} title={'Login'}>
      {(initialFocusButtonRef) => (
        <div className="grid gap-5">
          <SignInWithGithubBtn initialFocusButtonRef={initialFocusButtonRef} />
          <SignInWithGoogleBtn />
          <SignInWithDiscordBtn />
        </div>
      )}
    </Modal>
  );
});

export default LoginModal;
