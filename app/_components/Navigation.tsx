import { AddLinkModal, AddLinkModalTrigger } from '@/components/modals/LinkModals/AddLinkModal';
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
import { fetchProfile } from '@/lib/supabase/queries/fetch-profile';
import { fetchTags } from '@/lib/supabase/queries/fetch-tags';
import { createServerClient } from '@/lib/supabase/server';

import { LogOut, UserCircleIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

export async function Navigation() {
  const profile = await fetchProfile();
  const tags = await fetchTags();

  async function handleLogout() {
    'use server';

    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    await supabase.auth.signOut();
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
            <AddLinkModal profile={profile} tags={tags}>
              <AddLinkModalTrigger />
            </AddLinkModal>
          ) : (
            <LoginModal>
              <AddLinkModalTrigger />
            </LoginModal>
          )}

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ProfileAvatar fallbackProps={{ width: 40, height: 40, priority: true }} profile={profile} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <UserCircleIcon size={16} className="mr-2" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <form action={handleLogout}>
                    <button type="submit" className="w-full">
                      <DropdownMenuItem>
                        <LogOut size={16} className="mr-2" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginModal>
              <DialogTrigger asChild>
                <Button variant="default">Login</Button>
              </DialogTrigger>
            </LoginModal>
          )}
        </div>
      </div>
    </header>
  );
}
