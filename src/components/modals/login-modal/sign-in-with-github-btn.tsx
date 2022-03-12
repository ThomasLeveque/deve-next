import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../elements/button';

const SignInWithGithubBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignInWithGithub = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signIn({
        provider: 'github',
      });
    } catch (err) {
      toast.error(formatError(err as Error));
      console.error(err);
      setLoading(false);
    }
    // Do not setLoading(false) because Signin with Github will unmount this component.
  }, []);

  return <Button theme="black" text="login with github" loading={loading} fullWidth onClick={handleSignInWithGithub} />;
};

export default SignInWithGithubBtn;
