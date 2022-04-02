import { Comment } from '@models/comment';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { Nullable, PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

const getComments = async (linkId: number, cursor = 0): Promise<PaginatedData<Comment> | undefined> => {
  try {
    const nextCursor = cursor + COMMENTS_PER_PAGE;
    const response = await supabase
      .from<Comment>(dbKeys.comments)
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
  }
};

export const useComments = (linkId: Nullable<number>): UseInfiniteQueryResult<Nullable<PaginatedData<Comment>>> => {
  return useInfiniteQuery<Nullable<PaginatedData<Comment>>, Error>(
    queryKeys.comments(linkId as number),
    ({ pageParam = 0 }) => getComments(linkId as number, pageParam),
    {
      enabled: !!linkId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
