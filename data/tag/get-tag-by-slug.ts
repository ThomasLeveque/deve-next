import { formatTagWithLinksCount, GET_TAGS_SELECT } from '@/data/tag/utils';
import { createClientClient } from '@/lib/supabase/client';
import { Nullish } from '@/types/shared';

export type GetTagBySlugReturn = Awaited<ReturnType<typeof getTagBySlug>>;

export const getTagBySlug = async (tagSlug: Nullish<string>) => {
  if (!tagSlug) {
    return null;
  }

  try {
    const tag = await fetchTagBySlug(tagSlug);

    if (!tag) {
      throw new Error(`Cannot get tag with slug ${tagSlug}, try to reload the page`);
    }
    return formatTagWithLinksCount(tag);
  } catch (err) {
    console.error(err);
    return null;
  }
};

async function fetchTagBySlug(tagSlug: string) {
  const supabase = createClientClient();
  return (await supabase.from('tags').select(GET_TAGS_SELECT).eq('slug', tagSlug).single()).data;
}
