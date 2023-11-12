import { env } from '@/env';
import { OrderLinksKey } from '@/lib/constants';
import { createServerClient } from '@/lib/supabase/server';
import { Nullish } from '@/types/shared';
import { cookies } from 'next/headers';

export type FetchLinksReturn = Awaited<ReturnType<typeof fetchLinks>>;

export const fetchLinks = async (page: number, orderby: NonNullable<OrderLinksKey>, searchQuery: Nullish<string>) => {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  try {
    const from = page === 1 ? 0 : (page - 1) * env.NEXT_PUBLIC_LINKS_PER_PAGE;
    const to = page * env.NEXT_PUBLIC_LINKS_PER_PAGE - 1;

    let query = supabase.from('links').select(
      `
    *,
    user:profiles(*),
    tags(*),
    comments(*),
    votes(*)
  `
    );

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

    const response = await query.range(from, to);

    const links = response.data;

    if (!links) {
      throw new Error('Cannot fetch links, try to reload the page');
    }

    return links;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
