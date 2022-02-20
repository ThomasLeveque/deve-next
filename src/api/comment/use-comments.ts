import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { Comment } from '@models/comment';
import { Link } from '@models/link';

import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { PaginatedData, Nullable } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

const getComments = async (
  cursor = 0,
  linkId: number
): Promise<PaginatedData<Comment> | undefined> => {
  try {
    const nextCursor = cursor + COMMENTS_PER_PAGE;
    const response = await supabase
      .from<Comment>(dbKeys.comments)
      .select('*')
      .eq('linkId', linkId)
      .range(cursor, nextCursor);
    const comments = response.data;

    if (!comments) {
      throw new Error('Cannot get comments, try to reload the page');
    }

    return {
      data: comments,
      cursor: nextCursor,
    };
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useComments = (
  link: Nullable<Link>
): UseInfiniteQueryResult<Nullable<PaginatedData<Comment>>> => {
  const linkId = link?.id;
  return useInfiniteQuery<Nullable<PaginatedData<Comment>>>(
    queryKeys.comments(linkId as number),
    (context) => getComments(context.pageParam, linkId as number),
    {
      enabled: !!linkId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
