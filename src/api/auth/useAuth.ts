import { useProfile, useProfileLoaded } from '@store/profile.store';
import { User } from '@supabase/supabase-js';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Nullable } from '~types/shared';

export type GetUserProfileReturn = Awaited<ReturnType<typeof getUserProfile>>;

export const getUserProfile = async (user: Nullable<User>) => {
  if (!user) {
    return null;
  }

  try {
    const profile = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return profile.data;
  } catch (err) {
    toast.error(formatError(err as Error));
    return null;
  }
};

export const useAuth = (): void => {
  const [profile, setProfile] = useProfile();
  const setProfileLoaded = useProfileLoaded()[1];

  useEffect(() => {
    const setUserProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userProfile = await getUserProfile(session?.user);
      setProfile(userProfile);

      setProfileLoaded(true);
    };

    setUserProfile();

    const authState = supabase.auth.onAuthStateChange(() => {
      setUserProfile();
    });

    return () => authState.data?.subscription.unsubscribe();
  }, [setProfile, setProfileLoaded]);

  useEffect(() => {
    if (profile) {
      const userListener = supabase
        .channel('public:profiles')
        .on<GetUserProfileReturn & Record<string, unknown>>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${profile.id}` },
          (payload) => {
            switch (payload.eventType) {
              case 'DELETE':
                setProfile(null);
                supabase.removeChannel(userListener);
                break;
              case 'INSERT':
              case 'UPDATE':
                setProfile(payload.new);
                break;
              default:
                break;
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(userListener);
      };
    }
  }, [profile, setProfile]);
};
