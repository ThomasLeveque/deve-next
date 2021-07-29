import toast from 'react-hot-toast';
import {
  InfiniteData,
  QueryKey,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { removeItemInsidePaginatedData, addItemInsidePaginatedData } from '@utils/mutate-data';
import { Document, PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';
import { useUpdateLink } from './use-update-link';

const removeLinkComment = async (
  linkId: string | undefined,
  commentId: string | undefined
): Promise<InfiniteData<PaginatedData<Comment>>> => {
  if (!linkId || !commentId) {
    throw new Error('This link or comment does not exist');
  }

  await db.doc(dbKeys.comment(linkId, commentId)).delete();
  return {} as InfiniteData<PaginatedData<Comment>>;
};

export const useRemoveLinkComment = (
  link: Document<Link>,
  linksQueryKey: QueryKey
): UseMutationResult<
  InfiniteData<PaginatedData<Comment>>,
  Error,
  Document<Comment>,
  Document<Comment>
> => {
  const queryClient = useQueryClient();
  const commentsKey = queryKeys.linkComments(link.id as string);
  const updateLink = useUpdateLink(link, linksQueryKey);

  return useMutation((comment) => removeLinkComment(link.id, comment.id), {
    onMutate: async (comment) => {
      await queryClient.cancelQueries(commentsKey);

      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(commentsKey, (oldComments) =>
        removeItemInsidePaginatedData(comment.id as string, oldComments)
      );
      updateLink.mutate({ commentCount: link.commentCount - 1 });

      return comment;
    },
    onError: (err, variables, removedComment) => {
      toast.error(formatError(err));
      if (removedComment) {
        queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(commentsKey, (oldComments) =>
          addItemInsidePaginatedData(removedComment, oldComments)
        );
        updateLink.mutate({ commentCount: link.commentCount + 1 });
      }
    },
  });
};
