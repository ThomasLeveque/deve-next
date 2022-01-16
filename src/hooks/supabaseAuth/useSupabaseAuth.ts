import { Profile, useProfile } from '@store/profile.store';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabase } from '@utils/init-supabase';

const getProfile = async (session: Session): Promise<Profile | null> => {
  if (!session.user?.id) {
    throw new Error('Session user not found');
  }

  const profile = await supabase
    .from<Profile>('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  return profile.data;
};

export const useSupabaseAuth = (): void => {
  const [session, setSession] = useState<Session | null>(null);

  const setProfile = useProfile()[1];

  useEffect(() => {
    setSession(supabase.auth.session());

    const authState = supabase.auth.onAuthStateChange((_event, session) => {
      supabase
        .from<Profile>('profiles')
        .upsert([
          {
            id: session?.user?.id,
            username: session?.user?.user_metadata.name,
            email: session?.user?.email,
            avatarUrl: session?.user?.user_metadata.avatar_url,
          },
        ])
        .then(() => {
          setSession(session);
        });
    });

    return () => authState.data?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    getProfile(session).then(setProfile);

    const profile = supabase
      .from<Profile>(`profiles:id=eq.${session.user?.id}`)
      .on('*', (payload) => {
        if (payload.eventType === 'DELETE') {
          setProfile(null);
          setSession(null);
          profile.unsubscribe();
        } else {
          setProfile(payload.new);
        }
      })
      .subscribe();

    return () => {
      profile.unsubscribe();
    };
  }, [session]);
};
