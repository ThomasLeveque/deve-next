import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';
import useDebounce from '@hooks/useDebounce';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import toast from 'react-hot-toast';
import { useInfiniteQuery } from 'react-query';
import { queryKeys } from './query-keys';

export const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

export type GetLinksReturn = Awaited<ReturnType<typeof getLinks>>;

const getLinks = async (cursor = 0, orderby: OrderLinksKey, searchQuery = '') => {
  try {
    const nextCursor = cursor + LINKS_PER_PAGE;
    let query = supabase.from('links').select(`
    *,
    user:profiles!links_userId_fkey(*),
    tags(*),
    comments(*),
    votes(*)
  `);

    if (orderby === 'newest') {
      query = query.order('createdAt', { ascending: false });
    }

    if (orderby === 'oldest') {
      query = query.order('createdAt', { ascending: true });
    }

    if (orderby === 'liked') {
      query = query.order('votesCount', { ascending: false }).order('createdAt', { ascending: false });
    }

    if (searchQuery) {
      query = query.textSearch('description', searchQuery);
    }

    const response = await query.range(cursor, nextCursor - 1);
    const links = response.data;

    if (!links) {
      throw new Error('Cannot get links, try to reload the page');
    }

    return {
      data: links,
      cursor: links.length < LINKS_PER_PAGE ? undefined : nextCursor,
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

export const useLinks = () => {
  const { orderbyQuery, searchQuery } = useQueryString();
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 500);

  return useInfiniteQuery(
    queryKeys.links(orderbyQuery, debouncedSearchQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, debouncedSearchQuery),
    {
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
