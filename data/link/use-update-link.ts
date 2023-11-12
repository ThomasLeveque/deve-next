import { destructiveToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import { FetchTagsReturn } from '@/lib/supabase/queries/fetch-tags';
import { Database } from '@/types/supabase';
import { formatError } from '@/utils/format-string';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

type LinkUpdate = Database['public']['Tables']['links']['Update'];
export type UpdateLinkReturn = Awaited<ReturnType<typeof updateLink>>;

export const updateLink = async (linkId: number, linkToUpdate: LinkUpdate, tags: FetchTagsReturn = []) => {
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
      destructiveToast({
        description: formatError(new Error('Error during updating the tags of this link, please try again')),
      });
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

  updatedLink.tags = tags;

  return { updatedLink, linksTagsToAdd, linksTagsToRemove };
};

export const useUpdateLink = (): UseMutationResult<
  UpdateLinkReturn,
  Error,
  { linkId: number; linkToUpdate: LinkUpdate; tags: FetchTagsReturn }
> => {
  return useMutation({
    mutationFn: ({ linkId, linkToUpdate, tags }) => updateLink(linkId, linkToUpdate, tags),
  });
};
