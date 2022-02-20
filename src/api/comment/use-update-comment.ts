import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Comment } from '@models/comment';

import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const updateComment = async (
  commentId: number,
  commentToUpdate: Partial<Comment>
): Promise<Comment> => {
  const response = await supabase
    .from<Comment>(dbKeys.comments)
    .update(commentToUpdate)
    .eq('id', commentId)
    .single();
  const updatedComment = response.data;

  if (!updatedComment || response.error) {
    throw new Error('Error during updating a comment, please try again');
  }
  return updatedComment;
};

export const useUpdateLinkComment = (
  linkId: number
): UseMutationResult<
  Comment,
  Error,
  { commentId: number; commentToUpdate: Partial<Comment> },
  Comment
> => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ commentId, commentToUpdate }) => updateComment(commentId, commentToUpdate),
    {
      onSuccess: async (updatedComment) => {
        queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(
          queryKeys.comments(linkId),
          (oldComments) => updateItemInsidePaginatedData(updatedComment, oldComments)
        );
      },
      onError: (err) => {
        toast.error(formatError(err as Error));
      },
    }
  );
};
