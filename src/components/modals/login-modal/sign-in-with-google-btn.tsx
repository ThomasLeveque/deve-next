import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../elements/button';

const SignInWithGoogleBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signIn({
        provider: 'google',
      });
    } catch (err) {
      toast.error(formatError(err as Error));
      console.error(err);
      setLoading(false);
    }
    // Do not setLoading(false) because Signin with google will unmount this component.
  }, []);

  return (
    <Button theme="secondary" text="login with google" loading={loading} fullWidth onClick={handleSignInWithGoogle} />
  );
};

export default SignInWithGoogleBtn;
