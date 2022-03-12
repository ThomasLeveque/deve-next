import { Link } from '@models/link';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const USER_LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

const getUserLinks = async (cursor = 0, userId: string): Promise<PaginatedData<Link> | undefined> => {
  try {
    const nextCursor = cursor + USER_LINKS_PER_PAGE - 1;
    const response = await supabase
      .from<Link>(dbKeys.links)
      .select(dbKeys.selectLinks)
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(cursor, nextCursor);

    const userLinks = response.data;

    if (!userLinks) {
      throw new Error('Cannot get user links, try to reload the page');
    }

    return {
      data: userLinks,
      cursor: nextCursor,
    };
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useUserLinks = (userId: string | undefined): UseInfiniteQueryResult<PaginatedData<Link> | undefined> =>
  useInfiniteQuery<PaginatedData<Link> | undefined>(
    queryKeys.userLinks(userId as string),
    (context) => getUserLinks(context.pageParam, userId as string),
    {
      enabled: !!userId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
