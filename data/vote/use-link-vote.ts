import { destructiveToast } from '@/components/ui/use-toast';
import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

type VoteInsert = Database['public']['Tables']['votes']['Insert'];
export type AddVoteReturn = Awaited<ReturnType<typeof addVote>>;

async function addVote(voteToAdd: VoteInsert) {
  const supabase = createClientClient();
  const response = await supabase.from('votes').insert(voteToAdd).select().single();
  const newVote = response.data;

  if (!newVote || response.error) {
    throw new Error('Error during adding a new vote, please try again');
  }
  return newVote;
}

export type RemoveVoteReturn = Awaited<ReturnType<typeof removeVote>>;

async function removeVote(voteId: number) {
  const supabase = createClientClient();
  const response = await supabase.from('votes').delete().eq('id', voteId).select().single();

  const removedVote = response.data;

  if (!removedVote || response.error) {
    throw new Error('Error during removing a vote, please try again');
  }
  return removedVote;
}

type UseLinkVoteInput =
  | { type: 'add'; voteToAdd: VoteInsert; voteId?: never }
  | { type: 'remove'; voteId: number; voteToAdd?: never };

export const useLinkVote = (
  options: UseMutationOptions<AddVoteReturn, Error, UseLinkVoteInput>
): UseMutationResult<AddVoteReturn, Error, UseLinkVoteInput> => {
  return useMutation({
    mutationFn: ({ voteToAdd, voteId, type }) => (type === 'add' ? addVote(voteToAdd) : removeVote(voteId)),
    ...options,
    onError(error, variables, context) {
      destructiveToast({
        description: error.message,
      });
      options?.onError?.(error, variables, context);
    },
  });
};
