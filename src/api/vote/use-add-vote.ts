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

const addVote = async (voteToAdd: Partial<Vote>): Promise<Vote> => {
  const response = await supabase
    .from<Vote>(dbKeys.votes)
    .insert(voteToAdd)
    .select(`*, link:links(votesCount)`)
    .single();
  const newVote = response.data;

  if (!newVote || response.error) {
    throw new Error('Error during adding a new vote, please try again');
  }
  return newVote;
};

export const useAddLinkComment = (linkId: number): UseMutationResult<Vote, Error, Partial<Vote>, Vote> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((voteToAdd) => addVote(voteToAdd), {
    onSuccess: async (newVote) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData({ id: linkId, votesCount: (newVote.link?.votesCount ?? 0) + 1 }, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
