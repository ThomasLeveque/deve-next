'use client';

import { GetUserProfileReturn } from '@data/auth/get-user-profile';
import { Session } from '@supabase/supabase-js';
import { createBrowserClient } from '@utils/supabase-client';
import { atom, createStore, Provider } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Nullable } from '~types/shared';

type SupabaseAtom = {
  supabase: ReturnType<typeof createBrowserClient>;
  session: Nullable<Session>;
  profile: Nullable<GetUserProfileReturn>;
};

const supabaseStore = createStore();

export const supabaseAtom = atom<SupabaseAtom>({
  supabase: createBrowserClient(),
  session: null,
  profile: null,
});

export const useSupabase = () => supabaseStore.get(supabaseAtom);

// this component handles refreshing server data when the user logs in or out
// this method avoids the need to pass a session down to child components
// in order to re-render when the user's session changes
// #elegant!
export default function SupabaseAuthProvider({
  session,
  profile,
  children,
}: Pick<SupabaseAtom, 'session' | 'profile'> & { children: React.ReactNode }) {
  const supabase = supabaseStore.get(supabaseAtom).supabase;

  supabaseStore.set(supabaseAtom, { supabase, session, profile });

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
    <Provider store={supabaseStore}>
      <>{children}</>
    </Provider>
  );
}
