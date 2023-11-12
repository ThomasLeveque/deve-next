import { useToast } from '@/components/ui/use-toast';
import { GetCommentsReturn } from '@/data/comment/use-comments';
import { createClientClient } from '@/lib/supabase/client';
import { formatError } from '@/utils/format-string';
import { removeItemInsidePaginatedData } from '@/utils/mutate-data';
import { InfiniteData, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

export type RemoveLinkCommentReturn = Awaited<ReturnType<typeof removeLinkComment>>;

const removeLinkComment = async (commentId: number) => {
  const supabase = createClientClient();
  const response = await supabase
    .from('comments')
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

export const useRemoveLinkComment = (linkId: number): UseMutationResult<RemoveLinkCommentReturn, Error, number> => {
  const queryClient = useQueryClient();
  const { destructiveToast } = useToast();

  return useMutation({
    mutationFn: (commentId) => removeLinkComment(commentId),
    onSuccess: async (removedComment) => {
      queryClient.setQueryData<InfiniteData<GetCommentsReturn>>(queryKeys.comments(linkId), (oldComments) =>
        removeItemInsidePaginatedData(removedComment.id, oldComments)
      );
    },
    onError: (err) => {
      destructiveToast({ description: formatError(err) });
    },
  });
};
