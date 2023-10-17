import GoogleIcon from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/Button';
import { formatError } from '@/utils/format-string';
import { supabase } from '@/utils/supabase-client';
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
    <Button variant="google" isLoading={loading} className="w-full" onClick={handleSignInWithGoogle}>
      <GoogleIcon className="mr-2 w-4" /> Google
    </Button>
  );
};

export default SignInWithGoogleBtn;
