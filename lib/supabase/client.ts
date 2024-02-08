import { env } from '@/env';
import { Database } from '@/types/supabase';
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';

export const createClientClient = () =>
  createSupabaseBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
