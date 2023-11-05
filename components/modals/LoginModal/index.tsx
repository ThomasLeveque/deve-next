'use client';

import SignInWithGithubBtn from '@/components/modals/LoginModal/SignInWithGithubBtn';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PropsWithChildren, useState } from 'react';
import SignInWithDiscordBtn from './SignInWithDiscordBtn';
import SignInWithGoogleBtn from './SignInWithGoogleBtn';

function LoginModal({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

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
}

export default LoginModal;
