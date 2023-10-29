'use client';

import AddLinkModal from '@/components/modals/AddLinkModal';
import LoginModal from '@/components/modals/LoginModal';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClientClient } from '@/lib/supabase/client';
import { useProfile, useProfileLoaded } from '@/store/profile.store';

import { LogOut, UserCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const profile = useProfile()[0];
  const profileLoaded = useProfileLoaded()[0];

  const router = useRouter();

  function handleLogout() {
    const supabase = createClientClient();
    supabase.auth.signOut();
  }

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
                  <DropdownMenuItem onClick={handleLogout}>
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
}
