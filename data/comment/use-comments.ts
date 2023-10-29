import { destructiveToast } from '@/components/ui/use-toast';
import { env } from '@/env';
import { createClientClient } from '@/lib/supabase/client';
import { Nullish } from '@/types/shared';
import { formatError } from '@/utils/format-string';
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

export const COMMENTS_PER_PAGE = env.NEXT_PUBLIC_COMMENTS_PER_PAGE;

export type GetCommentsReturn = Awaited<ReturnType<typeof getComments>>;

const getComments = async (linkId: number, cursor: number) => {
  const supabase = createClientClient();
  try {
    const nextCursor = cursor + COMMENTS_PER_PAGE;
    const response = await supabase
      .from('comments')
      .select('*, user:profiles(*)')
      .order('createdAt', { ascending: false })
      .eq('linkId', linkId)
      .range(cursor, nextCursor - 1);
    const comments = response.data;

    if (!comments) {
      throw new Error('Cannot get comments, try to reload the page');
    }

    return {
      data: comments,
      cursor: comments.length < COMMENTS_PER_PAGE ? undefined : nextCursor,
    };
  } catch (err) {
    destructiveToast({ description: formatError(err as Error) });
    console.error(err);

    return {
      data: [],
      cursor: undefined,
    };
  }
};

export const useComments = (linkId: Nullish<number>, enabled = true) => {
  return useInfiniteQuery({
    queryKey: queryKeys.comments(linkId as number),
    queryFn: ({ pageParam }) => getComments(linkId as number, pageParam),
    getNextPageParam: (lastPage) => lastPage?.cursor,
    initialPageParam: 0,
    enabled,
  });
};
