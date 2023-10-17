'use client';

import AuthProtected from '@/components/AuthProtected';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/store/profile.store';
import { format } from 'date-fns';

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const profile = useProfile()[0];

  return (
    <AuthProtected>
      <div className="grid gap-9 sm:grid-cols-[250px,1fr]">
        {profile && (
          <>
            <aside className="sm:content-screen-height -mx-5 px-5 pt-8 sm:sticky sm:top-header sm:overflow-y-auto sm:pb-8">
              <ProfileAvatar className="mx-auto mb-6 h-16 w-16 sm:-ml-1" />
              <ul className="space-y-5 text-center sm:text-left">
                <li>
                  <h3 className="mb-1 text-[10px] font-bold uppercase">Username :</h3>
                  <h2 className="break-all text-sm">{profile.username}</h2>
                </li>
                <li>
                  <h3 className="mb-1 text-[10px] font-bold uppercase">Email :</h3>
                  <h2 className="break-all text-sm">{profile.email}</h2>
                </li>
                <li>
                  <h3 className="mb-2 text-[10px] font-bold uppercase">Admin status :</h3>
                  <Switch className="mx-auto sm:mx-0" disabled={true} checked={profile.role === 'admin'} />
                </li>
                <li>
                  <h3 className="mb-1 text-[10px] font-bold uppercase">Created at :</h3>
                  <h2 className="text-sm">{format(new Date(profile.createdAt), 'MMMM d yyyy')}</h2>
                </li>
                <li>
                  <h3 className="mb-1 text-[10px] font-bold uppercase">Last updated at :</h3>
                  <h2 className="text-sm">{format(new Date(profile.updatedAt), 'MMMM d yyyy')}</h2>
                </li>
              </ul>
            </aside>
            {children}
          </>
        )}
      </div>
    </AuthProtected>
  );
}
