import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@utils/init-supabase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { GetCommentsReturn } from 'api/comment/use-comments';
import { Database } from '~types/supabase';
import { queryKeys } from './query-keys';

type CommentUpdate = Database['public']['Tables']['comments']['Update'];
export type UpdateCommentReturn = Awaited<ReturnType<typeof updateComment>>;

const updateComment = async (commentId: number, commentToUpdate: CommentUpdate) => {
  const response = await supabase.from('comments').update(commentToUpdate).eq('id', commentId).select().single();
  const updatedComment = response.data;

  if (!updatedComment || response.error) {
    throw new Error('Error during updating a comment, please try again');
  }
  return updatedComment;
};

export const useUpdateLinkComment = (
  linkId: number
): UseMutationResult<UpdateCommentReturn, Error, { commentId: number; commentToUpdate: CommentUpdate }> => {
  const queryClient = useQueryClient();

  return useMutation(({ commentId, commentToUpdate }) => updateComment(commentId, commentToUpdate), {
    onSuccess: async (updatedComment) => {
      queryClient.setQueryData<InfiniteData<GetCommentsReturn>>(queryKeys.comments(linkId), (oldComments) =>
        updateItemInsidePaginatedData(updatedComment, oldComments)
      );
    },
  });
};
