import React, { useCallback, useState } from 'react';

import { useAuth } from '@hooks/auth/useAuth';

import Button from '../../elements/button';

const SignInWithGoogleBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { signInWithGoogle } = useAuth();

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  return (
    <Button
      theme="secondary"
      text="login with google"
      loading={loading}
      fullWidth
      onClick={handleSignInWithGoogle}
    />
  );
};

export default SignInWithGoogleBtn;
