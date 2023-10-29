import { getUserProfile } from '@/data/auth/get-user-profile';
import { createClientClient } from '@/lib/supabase/client';
import { useProfile, useProfileLoaded } from '@/store/profile.store';
import { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';

export function useAuth() {
  const supabase = createClientClient();
  const setProfile = useProfile()[1];
  const setProfileLoaded = useProfileLoaded()[1];

  useEffect(() => {
    const setUserProfile = async (session: Session | null) => {
      console.log({ session });

      const userProfile = await getUserProfile(session?.user);
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
