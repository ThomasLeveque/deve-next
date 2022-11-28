import { GetLinksReturn } from '@api/link/use-links';
import { supabase } from '@utils/init-supabase';
import { removeItemInsidePaginatedData } from '@utils/mutate-data';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { useLinksQueryKey } from './use-links-query-key';

export type RemoveLinkReturn = Awaited<ReturnType<typeof removeLink>>;

export const removeLink = async (linkId: number): Promise<number> => {
  await Promise.all([
    supabase.from('links_tags').delete().eq('linkId', linkId),
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

  return removedLink.id;
};

export const useRemoveLink = (): UseMutationResult<RemoveLinkReturn, Error, number> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation((linkId) => removeLink(linkId), {
    onSuccess: (removedLinkId) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        removeItemInsidePaginatedData(removedLinkId, oldLinks)
      );
    },
  });
};
