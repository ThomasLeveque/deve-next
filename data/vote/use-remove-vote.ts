import { useToast } from '@/components/ui/use-toast';
import { GetLinksReturn } from '@/data/link/get-links';
import { createClientClient } from '@/lib/supabase/client';
import { singleToArray } from '@/lib/utils';
import { formatError } from '@/utils/format-string';
import { updateItemInsidePaginatedData } from '@/utils/mutate-data';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useLinksQueryKey } from '../link/use-links-query-key';

export type RemoveVoteReturn = Awaited<ReturnType<typeof removeVote>>;

const removeVote = async (voteId: number) => {
  const supabase = createClientClient();
  const response = await supabase.from('votes').delete().eq('id', voteId).select().single();

  const removedVote = response.data;

  if (!removedVote || response.error) {
    throw new Error('Error during removing a vote, please try again');
  }
  return removedVote;
};

export const useRemoveLinkVote = (
  link: GetLinksReturn['data'][0]
): UseMutationResult<RemoveVoteReturn, Error, number> => {
  const queryClient = useQueryClient();
  const { destructiveToast } = useToast();

  const linksQueryKey = useLinksQueryKey();

  return useMutation({
    mutationFn: (voteId) => removeVote(voteId),
    onSuccess: async (removedVote) => {
      link.votesCount -= 1;
      link.votes = singleToArray(link.votes).filter((vote) => vote.id !== removedVote.id);

      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(link, oldLinks)
      );
    },
    onError: (err) => {
      destructiveToast({ description: formatError(err) });
    },
  });
};
