import { fetchUser } from '@/lib/queries/fetch-user';
import { createServerClient } from '@/lib/supabase/server';

import { cookies } from 'next/headers';

export type FetchProfileReturn = Awaited<ReturnType<typeof fetchProfile>>;

export async function fetchProfile() {
  try {
    const user = await fetchUser();

    if (!user) {
      return null;
    }

    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const profile = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return profile.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
