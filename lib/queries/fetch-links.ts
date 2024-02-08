import { env } from '@/env';
import { OrderLinksKey } from '@/lib/constants';
import { createServerClient } from '@/lib/supabase/server';
import { getTotalPages } from '@/lib/utils/get-total-pages';
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
  `,
      { count: 'exact' }
    );

    if (orderby === 'newest') {
      query = query.order('createdAt', { ascending: false });
    }

    if (orderby === 'oldest') {
      query = query.order('createdAt', { ascending: true });
    }

    if (orderby === 'liked') {
      // votes_count is define insi database functions (supabase)
      query = query.order('votes_count', { ascending: false }).order('createdAt', { ascending: false });
    }

    if (searchQuery) {
      // description_url is define insi database functions (supabase)
      query = query.textSearch('description_url', searchQuery);
    }

    const response = await query.range(from, to);

    const links = response.data;

    if (!links) {
      throw new Error('Cannot fetch links, try to reload the page');
    }

    return { links, totalPages: getTotalPages(response.count, env.NEXT_PUBLIC_LINKS_PER_PAGE) };
  } catch (err) {
    console.error(err);

    return { links: [], totalPages: null };
  }
};
