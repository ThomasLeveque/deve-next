import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '@api/auth/useAuth';

import { formatError } from '@utils/format-string';

import Button from '../../elements/button';

const SignInWithGithubBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { signInWithGithub } = useAuth();

  const handleSignInWithGithub = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithGithub();
    } catch (err) {
      toast.error(formatError(err as Error));
      console.error(err);
      setLoading(false);
    }
    // Do not setLoading(false) because Signin with Github will unmount this component.
  }, []);

  return (
    <Button
      theme="black"
      text="login with github"
      loading={loading}
      fullWidth
      onClick={handleSignInWithGithub}
    />
  );
};

export default SignInWithGithubBtn;
