import { Database } from '@/types/supabase';

export type TagRow = Database['public']['Tables']['tags']['Row'];
export type TagInsert = Database['public']['Tables']['tags']['Insert'];

export type LinkInsert = Database['public']['Tables']['links']['Insert'];
export type LinkUpdate = Database['public']['Tables']['links']['Update'];
