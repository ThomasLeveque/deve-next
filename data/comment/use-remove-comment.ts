import { GetCommentsReturn } from '@/data/comment/use-comments';
import { GetLinksReturn } from '@/data/link/get-links';
import { useLinksQueryKey } from '@/data/link/use-links-query-key';
import { arrayToSingle } from '@/lib/utils';
import { useLinkToCommentModal } from '@/store/modals.store';
import { formatError } from '@/utils/format-string';
import { removeItemInsidePaginatedData, updateItemInsidePaginatedData } from '@/utils/mutate-data';
import { supabase } from '@/utils/supabase-client';
import { InfiniteData, UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys } from './query-keys';

export type RemoveLinkCommentReturn = Awaited<ReturnType<typeof removeLinkComment>>;

const removeLinkComment = async (commentId: number) => {
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
  const [linkToCommentModal, setLinkToCommentModal] = useLinkToCommentModal();

  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((commentId) => removeLinkComment(commentId), {
    onSuccess: async (removedComment) => {
      queryClient.setQueryData<InfiniteData<GetCommentsReturn>>(queryKeys.comments(linkId), (oldComments) =>
        removeItemInsidePaginatedData(removedComment.id, oldComments)
      );

      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(
          { id: linkId, commentsCount: (arrayToSingle(removedComment.link)?.commentsCount ?? 0) - 1 },
          oldLinks
        )
      );
      if (linkToCommentModal) {
        setLinkToCommentModal({ ...linkToCommentModal, commentsCount: linkToCommentModal.commentsCount - 1 });
      }
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
