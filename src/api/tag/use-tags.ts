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
    const response = await supabase.from<Tag>(dbKeys.tags).select('*, links(*)');
    const tags = response.data;

    if (!tags) {
      throw new Error('Cannot get tags, try to reload the page');
    }
    return tags.sort((a, b) => (b.links?.length ?? 0) - (a.links?.length ?? 0) || a.name.localeCompare(b.name));
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
