'use client';

import { Button } from '@/components/ui/button';
import { destructiveToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import getAlternateUrl from '@/utils/alternate-url';
import { formatError } from '@/utils/format-string';
import { useMutation } from '@tanstack/react-query';
import { GithubIcon } from 'lucide-react';
import { useState } from 'react';

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function SignInWithGithubBtn() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const supabase = createClientClient();

      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: getAlternateUrl('/auth/callback'),
        },
      });

      await wait(3000);
    },
    onError(error) {
      destructiveToast({ description: formatError(error as Error) });
      console.error(error);
    },
  });

  return (
    <Button variant="github" className="w-full" type="submit" onClick={() => mutate()} isLoading={isLoading}>
      <GithubIcon className="mr-2 w-4" /> Github
    </Button>
  );
}

export default SignInWithGithubBtn;
