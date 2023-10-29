import { createClientClient } from '@/lib/supabase/client';
import { Nullish } from '@/types/shared';

import { User } from '@supabase/supabase-js';

export type GetUserProfileReturn = Awaited<ReturnType<typeof getUserProfile>>;

export const getUserProfile = async (user: Nullish<User>) => {
  if (!user) {
    return null;
  }

  const supabase = createClientClient();

  try {
    const profile = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return profile.data;
  } catch (err) {
    return null;
  }
};
