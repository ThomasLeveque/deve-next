import { useLinksQueryKey } from '@api/link/use-links-query-key';
import { Comment } from '@models/comment';
import { Link } from '@models/link';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { removeItemInsidePaginatedData, updateItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const removeLinkComment = async (commentId: number): Promise<Comment> => {
  const response = await supabase
    .from<Comment>(dbKeys.comments)
    .delete()
    .eq('id', commentId)
    .select(`*, link:links(commentsCount)`)
    .single();
  const removedComment = response.data;

  if (!removedComment || response.error) {
    throw new Error('Error during removing a comment, please try again');
  }
  return removedComment;
};

export const useRemoveLinkComment = (linkId: number): UseMutationResult<Comment, Error, number, Comment> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((commentId) => removeLinkComment(commentId), {
    onSuccess: async (removedComment) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(queryKeys.comments(linkId), (oldComments) =>
        removeItemInsidePaginatedData(removedComment.id, oldComments)
      );

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(
          { id: linkId, commentsCount: (removedComment.link?.commentsCount ?? 0) - 1 },
          oldLinks
        )
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
