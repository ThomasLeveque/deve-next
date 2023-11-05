import ProfilePageClient from '@/app/profile/page.client';
import { fetchProfile } from '@/lib/supabase/queries/fetch-profile';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Account',
};

export default async function ProfilePage() {
  const profile = await fetchProfile();

  if (!profile) {
    redirect('/');
  }

  return <ProfilePageClient profile={profile} />;
}
