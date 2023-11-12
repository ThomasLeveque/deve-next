import { GET_TAGS_SELECT } from '@/lib/constants';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export type FetchTagBySlugReturn = Awaited<ReturnType<typeof fetchTagBySlug>>;

export async function fetchTagBySlug(tagSlug: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  try {
    const response = await supabase.from('tags').select(GET_TAGS_SELECT).eq('slug', tagSlug).single();

    const tag = response.data;

    if (!tag) {
      throw new Error(`Cannot get tag with slug ${tagSlug}, try to reload the page`);
    }
    return tag;
  } catch (err) {
    console.error(err);
    return null;
  }
}
