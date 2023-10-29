import { destructiveToast } from '@/components/ui/use-toast';
import { env } from '@/env';
import { OrderLinksKey } from '@/hooks/use-query-string';
import { createClientClient } from '@/lib/supabase/client';
import { formatError } from '@/utils/format-string';

export const LINKS_PER_PAGE = env.NEXT_PUBLIC_LINKS_PER_PAGE;

export type GetLinksReturn = Awaited<ReturnType<typeof getLinks>>;

export const getLinks = async (cursor: number, orderby: OrderLinksKey, searchQuery = '') => {
  const supabase = createClientClient();
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
    destructiveToast({ description: formatError(err as Error) });
    console.error(err);

    return {
      data: [],
      cursor: undefined,
    };
  }
};
