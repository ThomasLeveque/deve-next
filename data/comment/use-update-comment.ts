import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

type CommentUpdate = Database['public']['Tables']['comments']['Update'];
export type UpdateCommentReturn = Awaited<ReturnType<typeof updateComment>>;

const updateComment = async (commentId: number, commentToUpdate: CommentUpdate) => {
  const supabase = createClientClient();
  const response = await supabase.from('comments').update(commentToUpdate).eq('id', commentId).select().single();
  const updatedComment = response.data;

  if (!updatedComment || response.error) {
    throw new Error('Error during updating a comment, please try again');
  }
  return updatedComment;
};

export const useUpdateLinkComment = (): UseMutationResult<
  UpdateCommentReturn,
  Error,
  { commentId: number; commentToUpdate: CommentUpdate }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, commentToUpdate }) => updateComment(commentId, commentToUpdate),
    onSuccess: async (updatedComment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(updatedComment.linkId) });
    },
  });
};
