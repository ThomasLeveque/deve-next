import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type VoteInsert = Database['public']['Tables']['votes']['Insert'];
export type AddVoteReturn = Awaited<ReturnType<typeof addVote>>;

const addVote = async (voteToAdd: VoteInsert) => {
  const supabase = createClientClient();
  const response = await supabase.from('votes').insert(voteToAdd).select().single();
  const newVote = response.data;

  if (!newVote || response.error) {
    throw new Error('Error during adding a new vote, please try again');
  }
  return newVote;
};

export const useAddLinkVote = (): UseMutationResult<AddVoteReturn, Error, VoteInsert> => {
  return useMutation({
    mutationFn: (voteToAdd) => addVote(voteToAdd),
  });
};
