import { Nullable } from '@/types/shared';
import { formatError } from '@/utils/format-string';
import { supabase } from '@/utils/supabase-client';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys } from './query-keys';

export const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

export type GetCommentsReturn = Awaited<ReturnType<typeof getComments>>;

const getComments = async (linkId: number, cursor: number) => {
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
    toast.error(formatError(err as Error));
    console.error(err);

    return {
      data: [],
      cursor: undefined,
    };
  }
};

export const useComments = (linkId: Nullable<number>, enabled = true) => {
  return useInfiniteQuery({
    queryKey: queryKeys.comments(linkId as number),
    queryFn: ({ pageParam }) => getComments(linkId as number, pageParam),
    getNextPageParam: (lastPage) => lastPage?.cursor,
    initialPageParam: 0,
    enabled,
  });
};
