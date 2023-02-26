import { GetLinksReturn } from '@data/link/get-links';
import { GetTagsReturn } from '@data/tag/get-tags';
import { queryKeys } from '@data/tag/utils';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { removeItemInsidePaginatedData } from '@utils/mutate-data';
import { supabase } from '@utils/supabase-client';
import { useRouter } from 'next/navigation';
import { updateItemsInsideData } from './../../utils/mutate-data';
import { useLinksQueryKey } from './use-links-query-key';

export type RemoveLinkReturn = Awaited<ReturnType<typeof removeLink>>;

export const removeLink = async (linkId: number) => {
  const [removedLinksTags] = await Promise.all([
    supabase.from('links_tags').delete().eq('linkId', linkId).select('tagId'),
    supabase.from('votes').delete().eq('linkId', linkId),
    supabase.from('comments').delete().eq('linkId', linkId),
  ]);

  const { data: removedLink, error: removedLinkError } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .select('id')
    .single();

  if (!removedLink || removedLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }

  const removedLinksTagsIds = removedLinksTags?.data?.map((linkTag) => linkTag.tagId) ?? [];

  return { linkId: removedLink.id, tagIds: removedLinksTagsIds };
};

export const useRemoveLink = (): UseMutationResult<RemoveLinkReturn, Error, number> => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = useLinksQueryKey();

  return useMutation((linkId) => removeLink(linkId), {
    onSuccess: ({ linkId, tagIds }) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        removeItemInsidePaginatedData(linkId, oldLinks)
      );

      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) =>
        updateItemsInsideData(
          tagIds.map((tagId) => {
            const tagLinkCount = oldTags?.find((tag) => tag.id === tagId)?.linksCount;
            return {
              id: tagId,
              linksCount: tagLinkCount ? tagLinkCount - 1 : 0,
            };
          }),
          oldTags
        )
      );

      router.refresh();
    },
  });
};
