'use client';

import GoogleIcon from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { destructiveToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import getAlternateUrl from '@/utils/alternate-url';
import { formatError } from '@/utils/format-string';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

function SignInWithGoogleBtn() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const supabase = createClientClient();

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAlternateUrl('/auth/callback'),
        },
      });
    },
    onError(error) {
      destructiveToast({ description: formatError(error as Error) });
      console.error(error);
    },
  });

  return (
    <Button variant="google" className="w-full" type="submit" onClick={() => mutate()} isLoading={isLoading}>
      <GoogleIcon className="mr-2 w-4" /> Google
    </Button>
  );
}

export default SignInWithGoogleBtn;
