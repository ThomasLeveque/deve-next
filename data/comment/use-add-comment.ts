import { GetCommentsReturn } from '@/data/comment/use-comments';
import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { addItemInsidePaginatedData } from '@/utils/mutate-data';
import { InfiniteData, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type AddCommentReturn = Awaited<ReturnType<typeof addComment>>;

const addComment = async (commentToAdd: CommentInsert) => {
  const supabase = createClientClient();
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

  return useMutation({
    mutationFn: (commentToAdd) => addComment(commentToAdd),
    onSuccess: async (newComment) => {
      queryClient.setQueryData<InfiniteData<GetCommentsReturn>>(queryKeys.comments(linkId), (oldComments) => {
        return addItemInsidePaginatedData(newComment, oldComments);
      });
    },
  });
};
