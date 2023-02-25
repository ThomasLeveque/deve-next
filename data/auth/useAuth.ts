import { getUserProfile } from '@data/auth/get-user-profile';
import { useProfile, useProfileLoaded } from '@store/profile.store';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@utils/supabase-client';
import { useEffect } from 'react';

export function useAuth() {
  const setProfile = useProfile()[1];
  const setProfileLoaded = useProfileLoaded()[1];

  useEffect(() => {
    const setUserProfile = async (session: Session | null) => {
      const userProfile = await getUserProfile(session?.user, supabase);
      setProfile(userProfile);
      setProfileLoaded(true);
    };

    supabase.auth.getSession().then(({ data }) => setUserProfile(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, clientSession) => {
      setUserProfile(clientSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setProfile, setProfileLoaded]);
}
