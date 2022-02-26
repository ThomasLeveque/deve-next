import { Tag } from '@models/tag';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { Nullable } from '@utils/shared-types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const getTags = async (): Promise<Nullable<Tag[]>> => {
  try {
    const response = await supabase.from<Tag>(dbKeys.tags).select('*');
    return response.data;
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useTags = (options?: UseQueryOptions<Nullable<Tag[]>>): UseQueryResult<Nullable<Tag[]>> =>
  useQuery(queryKeys.tags, () => getTags(), options);

export const usePrefetchTags = (): void => {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(queryKeys.tags, () => getTags());
  }, []);
};
