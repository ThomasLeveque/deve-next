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

const removeVote = async (voteId: number): Promise<Vote> => {
  const response = await supabase
    .from<Vote>(dbKeys.votes)
    .delete()
    .eq('id', voteId)
    .select(`*, link:links(votesCount)`)
    .single();
  const removedVote = response.data;

  if (!removedVote || response.error) {
    throw new Error('Error during removing a vote, please try again');
  }
  return removedVote;
};

export const useAddLinkComment = (linkId: number): UseMutationResult<Vote, Error, number, Vote> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((voteId) => removeVote(voteId), {
    onSuccess: async (removedVote) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData({ id: linkId, votesCount: (removedVote.link?.votesCount ?? 0) + 1 }, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
