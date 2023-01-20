import Button from '@components/elements/button';
import GoogleIcon from '@components/icons/google-icon';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const SignInWithGoogleBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
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
    <Button
      theme="google"
      icon={<GoogleIcon />}
      iconPosition="left"
      text="login with google"
      loading={loading}
      fullWidth
      onClick={handleSignInWithGoogle}
    />
  );
};

export default SignInWithGoogleBtn;
