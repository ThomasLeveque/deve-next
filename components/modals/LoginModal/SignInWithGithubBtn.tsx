import GithubIcon from '@/components/icons/GithubIcon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import getAlternateUrl from '@/utils/alternate-url';
import { formatError } from '@/utils/format-string';
import React, { useCallback, useState } from 'react';

const SignInWithGithubBtn: React.FC<{
  initialFocusButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
}> = ({ initialFocusButtonRef }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { destructiveToast } = useToast();

  const handleSignInWithGithub = useCallback(async () => {
    const supabase = createClientClient();
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: getAlternateUrl('/auth/callback'),
        },
      });
    } catch (err) {
      destructiveToast({ description: formatError(err as Error) });
      console.error(err);
      setLoading(false);
    }
    // Do not setLoading(false) because Signin with Github will unmount this component.
  }, []);

  return (
    <Button
      ref={initialFocusButtonRef}
      variant="github"
      isLoading={loading}
      className="w-full"
      onClick={handleSignInWithGithub}
    >
      <GithubIcon className="mr-2 w-4" /> Github
    </Button>
  );
};

export default SignInWithGithubBtn;
