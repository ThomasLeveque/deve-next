import { GetCommentsReturn } from '@/data/comment/use-comments';
import { GetLinksReturn } from '@/data/link/get-links';
import { arrayToSingle } from '@/lib/utils';
import { Database } from '@/types/supabase';
import { addItemInsidePaginatedData, updateItemInsidePaginatedData } from '@/utils/mutate-data';
import { supabase } from '@/utils/supabase-client';
import { InfiniteData, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLinksQueryKey } from '../link/use-links-query-key';
import { queryKeys } from './query-keys';

type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type AddCommentReturn = Awaited<ReturnType<typeof addComment>>;

const addComment = async (commentToAdd: CommentInsert) => {
  const response = await supabase
    .from('comments')
    .insert(commentToAdd)
    .select(`*, link:links(commentsCount), user:profiles(*)`)
    .single();

  const newComment = response.data;

  if (!newComment || response.error) {
    throw new Error('Error during adding a new comment, please try again');
  }
  return newComment;
};

export const useAddLinkComment = (linkId: number): UseMutationResult<AddCommentReturn, Error, CommentInsert> => {
  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((commentToAdd) => addComment(commentToAdd), {
    onSuccess: async (newComment) => {
      queryClient.setQueryData<InfiniteData<GetCommentsReturn>>(queryKeys.comments(linkId), (oldComments) => {
        return addItemInsidePaginatedData(newComment, oldComments);
      });

      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(
          { id: linkId, commentsCount: (arrayToSingle(newComment.link)?.commentsCount ?? 0) + 1 },
          oldLinks
        )
      );
    },
  });
};
