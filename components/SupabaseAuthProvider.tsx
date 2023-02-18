'use client';

import { GetUserProfileReturn } from '@api/auth/get-user-profile';
import { Session } from '@supabase/supabase-js';
import { createBrowserClient } from '@utils/supabase-client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Nullable } from '~types/shared';

type SupabaseContext = {
  supabase: ReturnType<typeof createBrowserClient>;
  session: Nullable<Session>;
  profile: Nullable<GetUserProfileReturn>;
};

const Context = createContext<SupabaseContext>({} as SupabaseContext);

export const useSupabase = () => useContext(Context);

// this component handles refreshing server data when the user logs in or out
// this method avoids the need to pass a session down to child components
// in order to re-render when the user's session changes
// #elegant!
export default function SupabaseAuthProvider({
  session,
  profile,
  children,
}: Pick<SupabaseContext, 'session' | 'profile'> & { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient());

  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, clientSession) => {
      if (clientSession?.access_token !== session?.access_token) {
        // server and client are out of sync
        // reload the page to fetch fresh server data
        // https://beta.nextjs.org/docs/data-fetching/mutating
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session?.access_token, router]);

  return (
    <Context.Provider value={{ supabase, session, profile }}>
      <>{children}</>
    </Context.Provider>
  );
}
