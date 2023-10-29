import { destructiveToast } from '@/components/ui/use-toast';
import { env } from '@/env';
import { createClientClient } from '@/lib/supabase/client';
import { formatError } from '@/utils/format-string';
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

export const USER_LINKS_PER_PAGE = env.NEXT_PUBLIC_LINKS_PER_PAGE;

export type GetUserLinksReturn = Awaited<ReturnType<typeof getUserLinks>>;

const getUserLinks = async (cursor: number, userId: string) => {
  const supabase = createClientClient();
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
    destructiveToast({ description: formatError(err as Error) });
    console.error(err);
  }
};

export const useUserLinks = (userId: string | undefined) =>
  useInfiniteQuery({
    queryKey: queryKeys.userLinks(userId as string),
    queryFn: ({ pageParam }) => getUserLinks(pageParam, userId as string),
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    initialPageParam: 0,
  });
