import { formatTagWithLinksCount, GET_TAGS_SELECT } from '@/data/tag/utils';
import { supabase } from '@/utils/supabase-client';

export type GetTagsReturn = Awaited<ReturnType<typeof getTags>>;

export const getTags = async () => {
  try {
    const tags = await fetchTags();

    if (!tags) {
      throw new Error('Cannot get tags, try to reload the page');
    }
    return tags
      .map(formatTagWithLinksCount)
      .sort((a, b) => b.linksCount - a.linksCount || a.name.localeCompare(b.name));
  } catch (err) {
    console.error(err);
    return [];
  }
};

export type FetchTagsReturn = Awaited<ReturnType<typeof fetchTags>>;

async function fetchTags() {
  return (await supabase.from('tags').select(GET_TAGS_SELECT)).data;
}
