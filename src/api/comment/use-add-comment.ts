import { Comment } from '@models/comment';
import { Link } from '@models/link';
import { useLinkToCommentModal } from '@store/modals.store';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { addItemInsidePaginatedData, updateItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { useLinksQueryKey } from '../link/use-links-query-key';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const addComment = async (commentToAdd: Partial<Comment>): Promise<Comment> => {
  const response = await supabase
    .from<Comment>(dbKeys.comments)
    .insert(commentToAdd)
    .select(`*, link:links(commentsCount), user:profiles(*)`)
    .single();
  const newComment = response.data;

  if (!newComment || response.error) {
    throw new Error('Error during adding a new comment, please try again');
  }
  return newComment;
};

export const useAddLinkComment = (linkId: number): UseMutationResult<Comment, Error, Partial<Comment>, Comment> => {
  const [linkToCommentModal, setLinkToCommentModal] = useLinkToCommentModal();

  const queryClient = useQueryClient();

  const linksQueryKey = useLinksQueryKey();

  return useMutation((commentToAdd) => addComment(commentToAdd), {
    onSuccess: async (newComment) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(queryKeys.comments(linkId), (oldComments) =>
        addItemInsidePaginatedData(newComment, oldComments)
      );

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksQueryKey, (oldLinks) =>
        updateItemInsidePaginatedData(
          { id: linkId, commentsCount: (newComment.link?.commentsCount ?? 0) + 1 },
          oldLinks
        )
      );
      if (linkToCommentModal) {
        setLinkToCommentModal({ ...linkToCommentModal, commentsCount: linkToCommentModal.commentsCount + 1 });
      }
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
