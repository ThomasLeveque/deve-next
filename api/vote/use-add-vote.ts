import { GetLinksReturn } from '@api/link/get-links';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { formatError } from '@utils/format-string';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { singleToArray } from '@utils/single-to-array';
import { supabase } from '@utils/supabase-client';
import toast from 'react-hot-toast';
import { Database } from '~types/supabase';
import { useLinksQueryKey } from '../link/use-links-query-key';

type VoteInsert = Database['public']['Tables']['votes']['Insert'];
export type AddVoteReturn = Awaited<ReturnType<typeof addVote>>;

const addVote = async (voteToAdd: VoteInsert) => {
  const response = await supabase.from('votes').insert(voteToAdd).select().single();
  const newVote = response.data;

  if (!newVote || response.error) {
    throw new Error('Error during adding a new vote, please try again');
  }
  return newVote;
};

export const useAddLinkVote = (
  link: GetLinksReturn['data'][0]
): UseMutationResult<AddVoteReturn, Error, VoteInsert> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((voteToAdd) => addVote(voteToAdd), {
    onSuccess: async (newVote) => {
      link.votesCount += 1;
      link.votes = [...singleToArray(link.votes), newVote];

      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(link, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
