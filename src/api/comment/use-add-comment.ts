import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Comment } from '@models/comment';

import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { addItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const addComment = async (commentToAdd: Partial<Comment>): Promise<Comment> => {
  const response = await supabase.from<Comment>(dbKeys.comments).insert(commentToAdd).single();
  const newComment = response.data;

  if (!newComment || response.error) {
    throw new Error('Error during adding a new comment, please try again');
  }
  return newComment;
};

export const useAddLinkComment = (
  linkId: number
): UseMutationResult<Comment, Error, Partial<Comment>, Comment> => {
  const queryClient = useQueryClient();

  return useMutation((commentToAdd) => addComment(commentToAdd), {
    onSuccess: async (newComment) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(
        queryKeys.comments(linkId),
        (oldComments) => addItemInsidePaginatedData(newComment, oldComments)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
