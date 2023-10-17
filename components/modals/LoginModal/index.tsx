import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useProfile } from '@/store/profile.store';
import { PropsWithChildren, useEffect, useState } from 'react';
import SignInWithDiscordBtn from './SignInWithDiscordBtn';
import SignInWithGithubBtn from './SignInWithGithubBtn';
import SignInWithGoogleBtn from './SignInWithGoogleBtn';

function LoginModal({ children }: PropsWithChildren) {
  const profile = useProfile()[0];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (profile && open) {
      setOpen(false);
    }
  }, [profile, open]);

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