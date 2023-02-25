import { GetLinksReturn } from '@data/link/get-links';
import { GetTagsReturn } from '@data/tag/get-tags';
import { queryKeys } from '@data/tag/utils';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { formatError } from '@utils/format-string';
import { updateItemInsidePaginatedData, updateItemsInsideData } from '@utils/mutate-data';
import { singleToArray } from '@utils/single-to-array';
import { supabase } from '@utils/supabase-client';
import toast from 'react-hot-toast';
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
      toast.error(formatError(new Error('Error during updating the tags of this link, please try again')));
    }
  }

  const linksTagsToAdd = tags.filter(
    (tag) =>
      !singleToArray(updatedLink.tags)
        .map((t) => t.id)
        ?.includes(tag.id)
  );
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
  { linkId: number; linkToUpdate: LinkUpdate; tags: GetTagsReturn }
> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation(({ linkId, linkToUpdate, tags }) => updateLink(linkId, linkToUpdate, tags), {
    onSuccess: ({ updatedLink, linksTagsToAdd, linksTagsToRemove }) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        updateItemInsidePaginatedData(updatedLink, oldLinks)
      );

      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) =>
        updateItemsInsideData(
          [
            ...linksTagsToAdd.map(({ id }) => {
              const tagLinkCount = oldTags?.find((tag) => tag.id === id)?.linksCount;
              return {
                id: id,
                linksCount: tagLinkCount ? tagLinkCount + 1 : 0,
              };
            }),
            ...linksTagsToRemove.map(({ id }) => {
              const tagLinkCount = oldTags?.find((tag) => tag.id === id)?.linksCount;
              return {
                id: id,
                linksCount: tagLinkCount ? tagLinkCount - 1 : 0,
              };
            }),
          ],
          oldTags
        )
      );
    },
  });
};
