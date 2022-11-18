import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { singleToArray } from '@utils/single-to-array';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from 'react-query';
import { queryKeys } from './query-keys';

export type GetTagsReturn = Awaited<ReturnType<typeof getTags>>;

export const getTags = async () => {
  try {
    const response = await supabase.from('tags').select('*, links(*)');
    const tags = response.data;

    if (!tags) {
      throw new Error('Cannot get tags, try to reload the page');
    }
    return tags.sort(
      (a, b) =>
        (singleToArray(b.links).length ?? 0) - (singleToArray(a.links).length ?? 0) || a.name.localeCompare(b.name)
    );
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useTags = (options?: UseQueryOptions<GetTagsReturn>): UseQueryResult<GetTagsReturn> =>
  useQuery(queryKeys.tags, () => getTags(), options);

export const usePrefetchTags = (): void => {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(queryKeys.tags, () => getTags());
  }, []);
};
