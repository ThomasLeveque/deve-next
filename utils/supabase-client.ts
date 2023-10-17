import { Database } from '@/types/supabase';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

const createBrowserClient = () => createBrowserSupabaseClient<Database>();

export const supabase = createBrowserClient();
