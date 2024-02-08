import { GET_TAGS_SELECT } from '@/lib/constants';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export type FetchTagsReturn = Awaited<ReturnType<typeof fetchTags>>;

export async function fetchTags() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  try {
    const response = await supabase.from('tags').select(GET_TAGS_SELECT);

    const tags = response.data;

    if (!tags) {
      throw new Error('Cannot fetch tags, try to reload the page');
    }
    return tags.sort((a, b) => b.links.length - a.links.length || a.name.localeCompare(b.name));
  } catch (err) {
    console.error(err);
    return [];
  }
}
