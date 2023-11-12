import { createClientClient } from '@/lib/supabase/client';
import { UseMutationOptions, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

export type RemoveLinkCommentReturn = Awaited<ReturnType<typeof removeLinkComment>>;

const removeLinkComment = async (commentId: number) => {
  const supabase = createClientClient();
  const response = await supabase.from('comments').delete().eq('id', commentId).select().single();
  const removedComment = response.data;

  if (!removedComment || response.error) {
    throw new Error('Error during removing a comment, please try again');
  }
  return removedComment;
};

export const useRemoveLinkComment = ({
  onSuccess,
  ...options
}: UseMutationOptions<RemoveLinkCommentReturn, Error, number> = {}): UseMutationResult<
  RemoveLinkCommentReturn,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => removeLinkComment(commentId),
    onSuccess: async (removedComment, ...params) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(removedComment.linkId) });
      onSuccess?.(removedComment, ...params);
    },
    ...options,
  });
};
