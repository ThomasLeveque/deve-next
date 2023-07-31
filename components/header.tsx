'use client';

import { Button } from '@/components/ui/button';
import { useAddLinkModalOpen, useAuthModalOpen } from '@/store/modals.store';
import { useProfile, useProfileLoaded } from '@/store/profile.store';
import { supabase } from '@/utils/supabase-client';
import { LogOut, PlusIcon, UserCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import MenuDropdown, { MenuDropdownItemProps } from './elements/menu-dropdown';
import { ProfileAvatar } from './elements/profile-avatar';

const Header = () => {
  const profile = useProfile()[0];
  const profileLoaded = useProfileLoaded()[0];

  const setAuthModalOpen = useAuthModalOpen()[1];
  const setAddLinkModalOpen = useAddLinkModalOpen()[1];

  const router = useRouter();

  const userDropdownItems: MenuDropdownItemProps[] = useMemo(
    () => [
      {
        text: 'Profil',
        onClick: () => router.push('/profil'),
        icon: <UserCircleIcon />,
      },
      {
        text: 'Logout',
        onClick: () => supabase.auth.signOut(),
        icon: <LogOut />,
      },
    ],
    [router]
  );

  function openAddLink() {
    if (profile) {
      setAddLinkModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
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
          <Button variant="default" className="hidden sm:flex" onClick={openAddLink}>
            Add link <PlusIcon size={18} className="ml-2" />
          </Button>
          <Button variant="default" size="icon" className="flex sm:hidden" onClick={openAddLink}>
            <PlusIcon size={18} />
          </Button>

          {profile ? (
            <MenuDropdown customButton={<ProfileAvatar className="cursor-pointer" />} items={userDropdownItems} />
          ) : (
            <Button
              variant="default"
              onClick={() => {
                if (profileLoaded) {
                  setAuthModalOpen(true);
                }
              }}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
