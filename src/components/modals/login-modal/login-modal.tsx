import Button from '@components/elements/button';
import Separator from '@components/elements/separator';
import SignInWithGoogleBtn from '@components/modals/login-modal/sign-in-with-google-btn';
import { useAuthModalOpen } from '@store/modals.store';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal } from '../modal';
import ResetPasswordForm from './reset-password-form';
import SignInForm from './sign-in-form';
import SignInWithGithubBtn from './sign-in-with-github-btn';
import SignUpForm from './sign-up-form';

export enum loginStep {
  LOGIN_SELECTION = 0,
  LOGIN_WITH_EMAIL,
  JOIN_NEXT_DEVE,
  PASSWORD_RECOVERY,
}

const LoginModal: React.FC = React.memo(() => {
  const [step, setStep] = useState<loginStep>(loginStep.LOGIN_SELECTION);

  const [authModalOpen, setAuthModalOpen] = useAuthModalOpen();

  const closeModal = useCallback(() => {
    setAuthModalOpen(false);
    setStep(loginStep.LOGIN_SELECTION);
  }, []);

  const renderTitle = useMemo(() => {
    switch (step) {
      case loginStep.LOGIN_SELECTION:
        return 'Login';
      case loginStep.LOGIN_WITH_EMAIL:
        return 'Login with  email';
      case loginStep.JOIN_NEXT_DEVE:
        return 'Join DEVE-NEXT';
      case loginStep.PASSWORD_RECOVERY:
        return 'Password recovery';
    }
  }, [step]);

  const renderContent = useMemo(() => {
    switch (step) {
      case loginStep.LOGIN_SELECTION:
        return (
          <>
            <div className="grid gap-5">
              <SignInWithGoogleBtn />
              <SignInWithGithubBtn />
              <Button text="login with email" onClick={() => setStep(loginStep.LOGIN_WITH_EMAIL)} fullWidth />
            </div>
            <Separator className="my-7" />
            <Button text="join next-deve" onClick={() => setStep(loginStep.JOIN_NEXT_DEVE)} fullWidth />
          </>
        );
      case loginStep.LOGIN_WITH_EMAIL:
        return <SignInForm setStep={setStep} />;
      case loginStep.JOIN_NEXT_DEVE:
        return <SignUpForm setStep={setStep} />;
      case loginStep.PASSWORD_RECOVERY:
        return <ResetPasswordForm setStep={setStep} />;
    }
  }, [step]);

  return (
    <Modal isOpen={authModalOpen} closeModal={closeModal} title={renderTitle}>
      {renderContent}
    </Modal>
  );
});

export default LoginModal;
