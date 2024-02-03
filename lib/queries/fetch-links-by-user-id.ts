import { env } from '@/env';
import { createServerClient } from '@/lib/supabase/server';
import { getTotalPages } from '@/lib/utils/get-total-pages';
import { cookies } from 'next/headers';

export type FetchLinksByUserIdReturn = Awaited<ReturnType<typeof fetchLinksByUserId>>;

export async function fetchLinksByUserId(userId: string, page: number) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  try {
    const from = page === 1 ? 0 : (page - 1) * env.NEXT_PUBLIC_LINKS_PER_PAGE;
    const to = page * env.NEXT_PUBLIC_LINKS_PER_PAGE - 1;

    const response = await supabase
      .from('links')
      .select(
        `
      *,
      user:profiles(*),
      tags(*),
      comments(*),
      votes(*)
    `,
        { count: 'exact' }
      )
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(from, to);

    const links = response.data;

    if (!links) {
      throw new Error('Cannot fetch links by userId, try to reload the page');
    }

    return { links, totalPages: getTotalPages(response.count, env.NEXT_PUBLIC_LINKS_PER_PAGE) };
  } catch (err) {
    console.error(err);

    return { links: [], totalPages: null };
  }
}
