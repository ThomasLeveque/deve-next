import { User } from '@supabase/supabase-js';
import { createServerClient } from '@utils/supabase-server';
import { Nullable } from '~types/shared';

export type GetUserProfileReturn = Awaited<ReturnType<typeof getUserProfile>>;

export const getUserProfile = async (user: Nullable<User>, supabase: ReturnType<typeof createServerClient>) => {
  if (!user) {
    return null;
  }

  try {
    const profile = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return profile.data;
  } catch (err) {
    // toast.error(formatError(err as Error));
    return null;
  }
};
