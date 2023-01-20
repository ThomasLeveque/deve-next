import { GetLinksReturn } from '@api/link/get-links';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { singleToArray } from '@utils/single-to-array';
import toast from 'react-hot-toast';
import { useLinksQueryKey } from '../link/use-links-query-key';

export type RemoveVoteReturn = Awaited<ReturnType<typeof removeVote>>;

const removeVote = async (voteId: number) => {
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

  const linksQueryKey = useLinksQueryKey();

  return useMutation((voteId) => removeVote(voteId), {
    onSuccess: async (removedVote) => {
      link.votesCount -= 1;
      link.votes = singleToArray(link.votes).filter((vote) => vote.id !== removedVote.id);

      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(link, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
