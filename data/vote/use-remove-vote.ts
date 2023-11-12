import { createClientClient } from '@/lib/supabase/client';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

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

export const useRemoveLinkVote = (): UseMutationResult<RemoveVoteReturn, Error, number> => {
  return useMutation({
    mutationFn: (voteId) => removeVote(voteId),
  });
};
