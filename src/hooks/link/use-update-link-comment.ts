import { updateDoc, doc } from 'firebase/firestore/lite';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { Document, PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const updateLinkComment = async (
  linkId: string | undefined,
  commentId: string | undefined,
  commentToUpdate: Partial<Document<Comment>>
): Promise<InfiniteData<PaginatedData<Comment>>> => {
  if (!linkId || !commentId) {
    throw new Error('This link or comment does not exist');
  }
  const commentRef = doc(db, dbKeys.comment(linkId, commentId));
  await updateDoc(commentRef, commentToUpdate);
  return {} as InfiniteData<PaginatedData<Comment>>;
};

export const useUpdateLinkComment = (
  link: Document<Link>,
  prevComment: Document<Comment>
): UseMutationResult<
  InfiniteData<PaginatedData<Comment>>,
  Error,
  Partial<Document<Comment>>,
  Document<Comment>
> => {
  const queryClient = useQueryClient();
  const commentsKey = queryKeys.linkComments(link.id as string);

  return useMutation(
    (commentToUpdate) => updateLinkComment(link.id, prevComment.id, commentToUpdate),
    {
      onMutate: async (commentToUpdate) => {
        await queryClient.cancelQueries(commentsKey);

        const newComment: Document<Comment> = { ...prevComment, ...commentToUpdate };

        queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(commentsKey, (oldComments) =>
          updateItemInsidePaginatedData(newComment, oldComments)
        );

        return prevComment;
      },
      onError: (err, variables, prevComment) => {
        toast.error(formatError(err as Error));
        if (prevComment) {
          queryClient.setQueryData<InfiniteData<PaginatedData<Comment>>>(
            commentsKey,
            (oldComments) => updateItemInsidePaginatedData(prevComment, oldComments)
          );
        }
      },
    }
  );
};
