import { DocumentReference } from '@firebase/firestore-types';
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
import { addItemToPaginatedData, removeItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData, Document } from '@utils/shared-types';

import { queryKeys } from './query-keys';
import { useUpdateLink } from './use-update-link';

const addLinkComment = async (
  commentRef: DocumentReference,
  comment: Comment
): Promise<InfiniteData<PaginatedData<Comment>>> => {
  await commentRef.set(comment);
  return {} as InfiniteData<PaginatedData<Comment>>;
};

export const useAddLinkComment = (
  link: Document<Link>,
  linksQueryKey: QueryKey
): UseMutationResult<
  InfiniteData<PaginatedData<Comment>>,
  Error,
  { commentRef: DocumentReference; comment: Comment },
  Document<Comment>
> => {
  const queryClient = useQueryClient();
  const commentsKey = queryKeys.linkComments(link.id as string);
  const updateLink = useUpdateLink(link, linksQueryKey);

  return useMutation(({ commentRef, comment }) => addLinkComment(commentRef, comment), {
    onMutate: async ({ commentRef, comment }) => {
      const newComment: Document<Comment> = { id: commentRef.id, ...comment };

      await queryClient.cancelQueries(commentsKey);

      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(commentsKey, (oldComments) =>
        addItemToPaginatedData(
          newComment,
          oldComments ?? ({} as InfiniteData<PaginatedData<Comment>>)
        )
      );

      return newComment;
    },
    onSuccess: () => {
      updateLink.mutate({ commentCount: link.commentCount + 1 });
    },
    onError: (err, variables, newComment) => {
      toast.error(formatError(err));
      queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(commentsKey, (oldComments) =>
        removeItemInsidePaginatedData(
          newComment?.id as string,
          oldComments ?? ({} as InfiniteData<PaginatedData<Comment>>)
        )
      );
    },
  });
};
