import { GetLinksReturn } from '@api/link/get-links';
import { useLinkToCommentModal } from '@store/modals.store';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { arrayToSingle } from '@utils/array-to-single';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { removeItemInsidePaginatedData, updateItemInsidePaginatedData } from '@utils/mutate-data';
import { GetCommentsReturn } from 'api/comment/use-comments';
import { useLinksQueryKey } from 'api/link/use-links-query-key';
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
