import { ModalsStore, useModalsStore } from '@store/modals.store';
import React from 'react';

import Button from '@components/elements/button';
import Separator from '@components/elements/separator';

import { Modal } from './modal';

const authModalSelector = (state: ModalsStore) => state.authModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

const LoginModal: React.FC = () => {
  const authModal = useModalsStore(authModalSelector);
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  return (
    <Modal isOpen={authModal} closeModal={toggleAuthModal} title="Login">
      <div className="grid gap-5">
        <Button text="login with google" fullWidth />
        <Button text="login with github" fullWidth className="!bg-black" />
        <Button text="login with email" fullWidth className="bg-primary text-black" />
      </div>
      <Separator className="my-7" />
      <Button text="join next-deve" fullWidth className="bg-primary text-black" />
    </Modal>
  );
};

export default LoginModal;
