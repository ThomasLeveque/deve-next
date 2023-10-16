import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/store/profile.store';
import React, { useEffect, useState } from 'react';
import SignInWithDiscordBtn from './sign-in-with-discord-btn';
import SignInWithGithubBtn from './sign-in-with-github-btn';
import SignInWithGoogleBtn from './sign-in-with-google-btn';

const LoginModal: React.FC = React.memo(() => {
  const profile = useProfile()[0];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (profile && open) {
      setOpen(false);
    }
  }, [profile, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Login</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Login with</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <SignInWithGithubBtn />
          <SignInWithGoogleBtn />
          <SignInWithDiscordBtn />
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default LoginModal;
