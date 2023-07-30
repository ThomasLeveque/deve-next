import { GetLinksReturn } from '@/data/link/get-links';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { queryKeys } from '@/data/tag/utils';
import { singleToArray } from '@/lib/utils';
import { Database } from '@/types/supabase';
import { addItemInsidePaginatedData, updateItemsInsideData } from '@/utils/mutate-data';
import { supabase } from '@/utils/supabase-client';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useLinksQueryKey } from './use-links-query-key';

type LinkInsert = Database['public']['Tables']['links']['Insert'];
export type AddLinkReturn = Awaited<ReturnType<typeof addLink>>;

export const addLink = async (linkToAdd: LinkInsert, tags: GetTagsReturn = []) => {
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

  newLink.tags = tags;

  return newLink;
};

export const useAddLink = (): UseMutationResult<
  AddLinkReturn,
  Error,
  { linkToAdd: LinkInsert; tags: GetTagsReturn }
> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation(({ linkToAdd, tags }) => addLink(linkToAdd, tags), {
    onSuccess: (newLink) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        addItemInsidePaginatedData(newLink, oldLinks)
      );

      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) =>
        updateItemsInsideData(
          singleToArray(newLink.tags).map(({ id }) => {
            const tagLinkCount = oldTags?.find((tag) => tag.id === id)?.linksCount;
            return {
              id: id,
              linksCount: tagLinkCount ? tagLinkCount + 1 : 0,
            };
          }),
          oldTags
        )
      );
    },
  });
};
