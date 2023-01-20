import { GetLinksReturn } from '@api/link/get-links';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { singleToArray } from '@utils/single-to-array';
import { GetTagsReturn } from 'api/tag/use-tags';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Database } from '~types/supabase';
import { useLinksQueryKey } from './use-links-query-key';

type LinkUpdate = Database['public']['Tables']['links']['Update'];
export type UpdateLinkReturn = Awaited<ReturnType<typeof updateLink>>;

export const updateLink = async (linkId: number, linkToUpdate: LinkUpdate, tags: GetTagsReturn = []) => {
  const { data: updatedLink, error: updatedLinkError } = await supabase
    .from('links')
    .update(linkToUpdate)
    .eq('id', linkId)
    .select(`*, tags(*)`)
    .single();

  if (!updatedLink || updatedLinkError) {
    throw new Error('Error during updating a link, please try again');
  }

  const linksTagsToRemove = singleToArray(updatedLink.tags).filter((tag) => !tags.map((t) => t.id)?.includes(tag.id));
  const shouldRemovelinksTags = linksTagsToRemove && linksTagsToRemove.length > 0;
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
      toast.error(formatError(new Error('Error during updating the tags of this link, please try again')));
    }
  }

  const linksTagsToAdd = tags.filter(
    (tag) =>
      !singleToArray(updatedLink.tags)
        .map((t) => t.id)
        ?.includes(tag.id)
  );
  const shouldAddlinksTags = Boolean(linksTagsToAdd && linksTagsToAdd.length > 0);
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

  return { updatedLink };
};

export const useUpdateLink = (): UseMutationResult<
  UpdateLinkReturn,
  Error,
  { linkId: number; linkToUpdate: LinkUpdate; tags: GetTagsReturn }
> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation(({ linkId, linkToUpdate, tags }) => updateLink(linkId, linkToUpdate, tags), {
    onSuccess: ({ updatedLink }) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        updateItemInsidePaginatedData(updatedLink, oldLinks)
      );
    },
  });
};
