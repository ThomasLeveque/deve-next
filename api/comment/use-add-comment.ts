import { GetLinksReturn } from '@api/link/get-links';
import { useLinkToCommentModal } from '@store/modals.store';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { arrayToSingle } from '@utils/array-to-single';
import { supabase } from '@utils/init-supabase';
import { addItemInsidePaginatedData, updateItemInsidePaginatedData } from '@utils/mutate-data';
import { GetCommentsReturn } from 'api/comment/use-comments';
import { Database } from '~types/supabase';
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
  const [linkToCommentModal, setLinkToCommentModal] = useLinkToCommentModal();

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
      if (linkToCommentModal) {
        setLinkToCommentModal({ ...linkToCommentModal, commentsCount: linkToCommentModal.commentsCount + 1 });
      }
    },
  });
};
