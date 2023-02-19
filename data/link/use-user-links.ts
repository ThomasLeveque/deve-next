import { useInfiniteQuery } from '@tanstack/react-query';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/supabase-client';
import toast from 'react-hot-toast';
import { queryKeys } from './query-keys';

export const USER_LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

export type GetUserLinksReturn = Awaited<ReturnType<typeof getUserLinks>>;

const getUserLinks = async (cursor = 0, userId: string) => {
  try {
    const nextCursor = cursor + USER_LINKS_PER_PAGE;
    const response = await supabase
      .from('links')
      .select(
        `
      *,
      user:profiles(*),
      tags(*),
      comments(*),
      votes(*)
    `
      )
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(cursor, nextCursor - 1);

    const userLinks = response.data;

    if (!userLinks) {
      throw new Error('Cannot get user links, try to reload the page');
    }

    return {
      data: userLinks,
      cursor: userLinks.length < USER_LINKS_PER_PAGE ? undefined : nextCursor,
    };
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useUserLinks = (userId: string | undefined) =>
  useInfiniteQuery(
    queryKeys.userLinks(userId as string),
    (context) => getUserLinks(context.pageParam, userId as string),
    {
      enabled: !!userId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
