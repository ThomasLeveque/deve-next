import Button from '@components/elements/button';
import GithubIcon from '@components/icons/github-icon';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const SignInWithGithubBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignInWithGithub = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
    } catch (err) {
      toast.error(formatError(err as Error));
      console.error(err);
      setLoading(false);
    }
    // Do not setLoading(false) because Signin with Github will unmount this component.
  }, []);

  return (
    <Button
      theme="github"
      icon={<GithubIcon />}
      iconPosition="left"
      text="login with github"
      loading={loading}
      fullWidth
      onClick={handleSignInWithGithub}
    />
  );
};

export default SignInWithGithubBtn;
