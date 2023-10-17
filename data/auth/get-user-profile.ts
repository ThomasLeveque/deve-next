import { Nullable } from '@/types/shared';
import { supabase } from '@/utils/supabase-client';
import { User } from '@supabase/supabase-js';

export type GetUserProfileReturn = Awaited<ReturnType<typeof getUserProfile>>;

export const getUserProfile = async (user: Nullable<User>, supabaseClient: typeof supabase) => {
  if (!user) {
    return null;
  }

  try {
    const profile = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
    return profile.data;
  } catch (err) {
    return null;
  }
};
