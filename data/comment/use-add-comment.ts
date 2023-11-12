import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { UseMutationOptions, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type AddCommentReturn = Awaited<ReturnType<typeof addComment>>;

const addComment = async (commentToAdd: CommentInsert) => {
  const supabase = createClientClient();
  const response = await supabase.from('comments').insert(commentToAdd).select().single();

  const newComment = response.data;

  if (!newComment || response.error) {
    throw new Error('Error during adding a new comment, please try again');
  }
  return newComment;
};

export const useAddLinkComment = ({
  onSuccess,
  ...options
}: UseMutationOptions<AddCommentReturn, Error, CommentInsert> = {}): UseMutationResult<
  AddCommentReturn,
  Error,
  CommentInsert
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentToAdd) => addComment(commentToAdd),
    onSuccess: (newComment, ...params) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(newComment.linkId) });
      onSuccess?.(newComment, ...params);
    },
    ...options,
  });
};
