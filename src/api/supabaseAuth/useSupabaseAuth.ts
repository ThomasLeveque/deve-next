import { Profile } from '@models/profile';
import { useProfile, useProfileLoaded } from '@store/profile.store';
import { User } from '@supabase/supabase-js';
import { supabase } from '@utils/init-supabase';
import { Nullable } from '@utils/shared-types';
import { useEffect } from 'react';

const getUserProfile = async (user: User): Promise<Profile | null> => {
  const profile = await supabase.from<Profile>('profiles').select('*').eq('id', user.id).single();
  return profile.data;
};

export const useSupabaseAuth = (): void => {
  const [profile, setProfile] = useProfile();
  const setProfileLoaded = useProfileLoaded()[1];

  useEffect(() => {
    const setUserProfile = async (user: Nullable<User>) => {
      if (user) {
        const userProfile = await getUserProfile(user);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setProfileLoaded(true);
    };
    setUserProfile(supabase.auth.user());

    const authState = supabase.auth.onAuthStateChange((_event, session) => {
      setUserProfile(session?.user);
    });

    return () => authState.data?.unsubscribe();
  }, []);

  useEffect(() => {
    if (profile) {
      const subscription = supabase
        .from<Profile>(`profiles:id=eq.${profile.id}`)
        .on('*', (payload) => {
          switch (payload.eventType) {
            case 'DELETE':
              setProfile(null);
              supabase.removeSubscription(subscription);
              break;
            case 'INSERT':
              setProfile(payload.new);
              break;
            default:
              break;
          }
        })
        .subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [profile]);
};
