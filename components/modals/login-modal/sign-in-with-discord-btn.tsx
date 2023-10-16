import DiscordIcon from '@/components/icons/discord-icon';
import { Button } from '@/components/ui/button';
import { formatError } from '@/utils/format-string';
import { supabase } from '@/utils/supabase-client';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const SignInWithDiscordBtn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'discord',
      });
    } catch (err) {
      toast.error(formatError(err as Error));
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
