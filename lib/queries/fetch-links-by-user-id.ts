import { env } from '@/env';
import { createServerClient } from '@/lib/supabase/server';
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
    `
      )
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(from, to);

    const userLinks = response.data;

    if (!userLinks) {
      throw new Error('Cannot fetch links by userId, try to reload the page');
    }

    return userLinks;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
