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
  const response = await supabase.from<Vote>(dbKeys.votes).insert(voteToAdd).single();
  const newVote = response.data;

  if (!newVote || response.error) {
    throw new Error('Error during adding a new vote, please try again');
  }
  return newVote;
};

export const useAddLinkVote = (link: Link): UseMutationResult<Vote, Error, Partial<Vote>, Vote> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((voteToAdd) => addVote(voteToAdd), {
    onSuccess: async (newVote) => {
      link.votesCount += 1;
      link.votes?.push(newVote);

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(link, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
