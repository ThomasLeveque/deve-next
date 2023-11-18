import { env } from '@/env';
import { GET_TAGS_SELECT } from '@/lib/constants';
import { createServerClient } from '@/lib/supabase/server';
import { getTotalPages } from '@/lib/utils/get-total-pages';
import { cookies } from 'next/headers';

export type FetchLinksByTagSlugReturn = Awaited<ReturnType<typeof fetchLinksByTagSlug>>;

export const fetchLinksByTagSlug = async (tagSlug: string, page: number) => {
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
      temp_tags:tags!inner(${GET_TAGS_SELECT}),
      tags(${GET_TAGS_SELECT}),
      comments(*),
      votes(*)
    `,
        { count: 'exact' }
      )
      .eq('temp_tags.slug', tagSlug)
      .order('createdAt', { ascending: false })
      .range(from, to);

    const tagLinks = response.data;

    if (!tagLinks) {
      throw new Error('Cannot get tag links, try to reload the page');
    }

    return { tagLinks, totalPages: getTotalPages(response.count, env.NEXT_PUBLIC_LINKS_PER_PAGE) };
  } catch (err) {
    console.error(err);

    return { tagLinks: [], totalPages: null };
  }
};
