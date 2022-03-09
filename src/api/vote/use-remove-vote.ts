import { Link } from '@models/link';
import { Vote } from '@models/vote';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { useLinksQueryKey } from '../link/use-links-query-key';
import { dbKeys } from './db-keys';

const removeVote = async (voteToRemove: Partial<Vote>): Promise<Vote> => {
  const response = await supabase
    .from<Vote>(dbKeys.votes)
    .delete()
    .match({
      userId: voteToRemove.userId,
      linkId: voteToRemove.linkId,
    })
    .single();
  const removedVote = response.data;

  if (!removedVote || response.error) {
    throw new Error('Error during removing a vote, please try again');
  }
  return removedVote;
};

export const useRemoveLinkVote = (link: Link): UseMutationResult<Vote, Error, Partial<Vote>, Vote> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((voteToRemove) => removeVote(voteToRemove), {
    onSuccess: async (removedVote) => {
      link.votesCount -= 1;
      link.votes = link.votes?.filter((vote) => vote.id !== removedVote.id);

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(link, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
