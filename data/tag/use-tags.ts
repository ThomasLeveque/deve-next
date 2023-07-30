import { getTags, GetTagsReturn } from '@/data/tag/get-tags';
import { Database } from '@/types/supabase';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from './utils';

export type TagRow = Database['public']['Tables']['tags']['Row'];

export const useTags = (options?: UseQueryOptions<GetTagsReturn>): UseQueryResult<GetTagsReturn> => {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: getTags,
    ...options,
    // enabled false because tags are fetch server side inside globalTagsClient component
    enabled: true,
  });
};
