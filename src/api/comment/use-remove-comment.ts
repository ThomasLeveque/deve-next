import { Comment } from '@models/comment';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { removeItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const removeLinkComment = async (commentId: number): Promise<number> => {
  const response = await supabase.from<Comment>(dbKeys.comments).delete().eq('id', commentId).single();
  const removedComment = response.data;

  if (!removedComment || response.error) {
    throw new Error('Error during removing a comment, please try again');
  }
  return removedComment.id;
};

export const useRemoveLinkComment = (linkId: number): UseMutationResult<number, Error, number, Comment> => {
  const queryClient = useQueryClient();

  return useMutation((commentId) => removeLinkComment(commentId), {
    onSuccess: async (removedCommentId) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(queryKeys.comments(linkId), (oldComments) =>
        removeItemInsidePaginatedData(removedCommentId, oldComments)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
