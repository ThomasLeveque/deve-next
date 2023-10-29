import { GetLinksReturn } from '@/data/link/get-links';
import { createClientClient } from '@/lib/supabase/client';
import { removeItemInsidePaginatedData } from '@/utils/mutate-data';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useLinksQueryKey } from './use-links-query-key';

export type RemoveLinkReturn = Awaited<ReturnType<typeof removeLink>>;

export const removeLink = async (linkId: number) => {
  const supabase = createClientClient();
  const { data: removedLink, error: removedLinkError } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .select('id')
    .single();

  if (!removedLink || removedLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }

  return { linkId: removedLink.id };
};

export const useRemoveLink = (): UseMutationResult<RemoveLinkReturn, Error, number> => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = useLinksQueryKey();

  return useMutation({
    mutationFn: (linkId) => removeLink(linkId),
    onSuccess: ({ linkId }) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        removeItemInsidePaginatedData(linkId, oldLinks)
      );

      router.refresh();
    },
  });
};
