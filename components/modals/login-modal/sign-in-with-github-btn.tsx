import GithubIcon from '@/components/icons/github-icon';
import { Button } from '@/components/ui/button';
import { formatError } from '@/utils/format-string';
import { supabase } from '@/utils/supabase-client';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const SignInWithGithubBtn: React.FC<{
  initialFocusButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
}> = ({ initialFocusButtonRef }) => {
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
      ref={initialFocusButtonRef}
      variant="default"
      // loading={loading}
      className="w-full"
      onClick={handleSignInWithGithub}
    >
      <GithubIcon className="mr-2" /> login with github
    </Button>
  );
};

export default SignInWithGithubBtn;
