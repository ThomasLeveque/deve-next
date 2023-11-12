import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { createClientClient } from '@/lib/supabase/client';
import { LinkUpdate } from '@/lib/supabase/types';

export const updateLink = async (linkId: number, linkToUpdate: LinkUpdate, tags: FetchTagsReturn) => {
  const supabase = createClientClient();
  const { data: updatedLink, error: updatedLinkError } = await supabase
    .from('links')
    .update(linkToUpdate)
    .eq('id', linkId)
    .select(`*, tags(*)`)
    .single();

  if (!updatedLink || updatedLinkError) {
    throw new Error('Error during updating a link, please try again');
  }

  const linksTagsToRemove = updatedLink.tags.filter((tag) => !tags.map((t) => t.id)?.includes(tag.id));
  const shouldRemovelinksTags = linksTagsToRemove.length > 0;
  if (shouldRemovelinksTags) {
    try {
      await Promise.all(
        linksTagsToRemove.map((tag) =>
          supabase.from('links_tags').delete().match({
            tagId: tag.id,
            linkId: updatedLink.id,
          })
        )
      );
    } catch (err) {
      throw new Error('Error during updating the tags of this link, please try again');
    }
  }

  const linksTagsToAdd = tags.filter((tag) => !updatedLink.tags.map((t) => t.id)?.includes(tag.id));
  const shouldAddlinksTags = linksTagsToAdd.length > 0;
  if (shouldAddlinksTags) {
    const { error: linksTagsToAddError } = await supabase.from('links_tags').insert(
      linksTagsToAdd.map((tag) => ({
        linkId: updatedLink.id,
        tagId: tag.id,
      }))
    );

    if (linksTagsToAddError) {
      throw new Error('Error during updating the tags of this link, please try again');
    }
  }
};
