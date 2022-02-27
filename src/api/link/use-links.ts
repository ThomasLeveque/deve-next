import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';
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
  tags: string[]
): Promise<PaginatedData<Link> | undefined> => {
  try {
    const nextCursor = cursor + LINKS_PER_PAGE - 1;
    let query = supabase.from(dbKeys.links).select(dbKeys.selectLinks);

    if (tags.length > 0) {
      query = query.in('tags.name', tags);
    }

    if (orderby === 'newest') {
      query = query.order('createdAt', { ascending: false });
    }

    if (orderby === 'oldest') {
      query = query.order('createdAt', { ascending: true });
    }

    if (orderby === 'liked') {
      query = query.order('votesCount', { ascending: false }).order('createdAt', { ascending: false });
    }

    const response = await query.range(cursor, nextCursor);
    const links = response.data;

    if (!links) {
      throw new Error('Cannot get user links, try to reload the page');
    }

    return {
      data: links,
      cursor: nextCursor,
    };
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useLinks = (): UseInfiniteQueryResult<PaginatedData<Link> | undefined> => {
  const { tagsQuery, orderbyQuery } = useQueryString();
  const router = useRouter();
  return useInfiniteQuery<PaginatedData<Link> | undefined>(
    queryKeys.links(orderbyQuery, tagsQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, tagsQuery),
    {
      enabled: router.isReady,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
