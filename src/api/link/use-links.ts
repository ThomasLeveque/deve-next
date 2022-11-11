import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';
import useDebounce from '@hooks/useDebounce';
import { Link } from '@models/link';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { PaginatedData } from '@utils/shared-types';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

const getLinks = async (
  cursor = 0,
  orderby: OrderLinksKey,
  searchQuery = ''
): Promise<PaginatedData<Link> | undefined> => {
  try {
    const nextCursor = cursor + LINKS_PER_PAGE;
    let query = supabase.from(dbKeys.links).select(dbKeys.selectLinks);

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
  }
};

export const useLinks = (): UseInfiniteQueryResult<PaginatedData<Link> | undefined> => {
  const { orderbyQuery, searchQuery } = useQueryString();
  const router = useRouter();
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 500);

  return useInfiniteQuery<PaginatedData<Link> | undefined>(
    queryKeys.links(orderbyQuery, debouncedSearchQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, debouncedSearchQuery),
    {
      enabled: router.isReady,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
