import { OrderLinksKey } from '@/hooks/use-query-string';
import { formatError } from '@/utils/format-string';
import { supabase } from '@/utils/supabase-client';
import toast from 'react-hot-toast';

export const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

export type GetLinksReturn = Awaited<ReturnType<typeof getLinks>>;

export const getLinks = async (cursor: number, orderby: OrderLinksKey, searchQuery = '') => {
  try {
    const nextCursor = cursor + LINKS_PER_PAGE;
    let query = supabase.from('links').select(`
    *,
    user:profiles(*),
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
