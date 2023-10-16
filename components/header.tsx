'use client';

import AddLinkModal from '@/components/modals/add-link-modal/add-link-modal';
import LoginModal from '@/components/modals/login-modal/login-modal';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProfile, useProfileLoaded } from '@/store/profile.store';
import { supabase } from '@/utils/supabase-client';
import { LogOut, UserCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProfileAvatar } from './elements/profile-avatar';

const Header = () => {
  const profile = useProfile()[0];
  const profileLoaded = useProfileLoaded()[0];

  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex h-header items-center justify-between px-5 xl:container xl:mx-auto">
        <div className="flex items-center space-x-5">
          <Link href="/" className="with-ring text-3xl font-bold">
            DN
          </Link>
          <Link href="/tags" className="with-ring px-1 font-bold hover:underline">
            Tags
          </Link>
        </div>
        <div className="grid auto-cols-max grid-flow-col items-center gap-5">
          {profile ? (
            <AddLinkModal>
              <AddLinkModal.Trigger />
            </AddLinkModal>
          ) : (
            <LoginModal>
              <AddLinkModal.Trigger />
            </LoginModal>
          )}

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ProfileAvatar />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/profil')}>
                    <UserCircleIcon size={16} className="mr-2" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginModal>
              <DialogTrigger
                asChild
                onClick={(event) => {
                  if (!profileLoaded) {
                    event.preventDefault();
                  }
                }}
              >
                <Button variant="default">Login</Button>
              </DialogTrigger>
            </LoginModal>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
