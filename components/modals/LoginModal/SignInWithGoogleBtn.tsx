import GoogleIcon from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import getAlternateUrl from '@/utils/alternate-url';
import { formatError } from '@/utils/format-string';
import React, { useCallback, useState } from 'react';

const SignInWithGoogleBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { destructiveToast } = useToast();
  const handleSignInWithGoogle = useCallback(async () => {
    const supabase = createClientClient();
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAlternateUrl('/auth/callback'),
        },
      });
    } catch (err) {
      destructiveToast({ description: formatError(err as Error) });
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
