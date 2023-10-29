import DiscordIcon from '@/components/icons/DiscordIcon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import getAlternateUrl from '@/utils/alternate-url';
import { formatError } from '@/utils/format-string';
import React, { useCallback, useState } from 'react';

const SignInWithDiscordBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { destructiveToast } = useToast();

  const handleSignInWithGoogle = useCallback(async () => {
    const supabase = createClientClient();
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'discord',
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
    <Button variant="discord" isLoading={loading} className="w-full" onClick={handleSignInWithGoogle}>
      <DiscordIcon className="mr-2 w-4" /> Discord
    </Button>
  );
};

export default SignInWithDiscordBtn;
