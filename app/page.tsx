import HomePageClient from '@/app/page.client';
import { fetchProfile } from '@/lib/supabase/queries/fetch-profile';

export default async function HomePage() {
  const profile = await fetchProfile();

  return <HomePageClient profile={profile} />;
}
