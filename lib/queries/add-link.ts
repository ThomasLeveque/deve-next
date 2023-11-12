import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { createClientClient } from '@/lib/supabase/client';
import { LinkInsert } from '@/lib/supabase/types';

export const addLink = async (linkToAdd: LinkInsert, tags: FetchTagsReturn) => {
  const supabase = createClientClient();
  const { data: newLink, error: newLinkError } = await supabase
    .from('links')
    .insert(linkToAdd)
    .select(
      `
      *,
      user:profiles(*),
      tags(*),
      comments(*),
      votes(*)
      `
    )
    .single();

  if (!newLink || newLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }

  const { data: newLinksTagsConnection, error: newLinksTagsConnectionError } = await supabase
    .from('links_tags')
    .insert(
      tags.map((tag) => ({
        linkId: newLink.id,
        tagId: tag.id,
      }))
    )
    .select('id');

  if (!newLinksTagsConnection || newLinksTagsConnectionError) {
    await supabase.from('links').delete().eq('id', newLink.id);
    throw new Error('Error during connecting a link to some tags, please try again');
  }
};
