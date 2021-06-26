import React, { useState } from 'react';

import { useAuth } from '@hooks/useAuth';

import Button from '../../elements/button';

const SignInWithGoogleBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Button text="login with google" loading={loading} fullWidth onClick={handleSignInWithGoogle} />
  );
};

export default SignInWithGoogleBtn;
