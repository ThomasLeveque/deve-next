import { DocumentSnapshot } from '@firebase/firestore-types';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { Comment } from '@data-types/comment.type';

import { dataToDocument } from '@utils/format-document';
import { db } from '@utils/init-firebase';
import { PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

const getLinkComments = async (
  cursor: DocumentSnapshot,
  linkId: string
): Promise<PaginatedData<Comment>> => {
  const commentsRef = db.collection(dbKeys.comments(linkId));

  const orderbyQuery = commentsRef.orderBy('createdAt', 'desc');
  const query = cursor !== undefined ? orderbyQuery.startAfter(cursor) : orderbyQuery;

  const snapshot = await query.limit(COMMENTS_PER_PAGE).get();
  const data = snapshot.docs.map((doc) => dataToDocument<Comment>(doc));
  const nextCursor = snapshot.docs[snapshot.docs.length - 1];
  return {
    data,
    cursor: nextCursor,
  };
};

export const useLinkComments = (
  linkId: string | undefined
): UseInfiniteQueryResult<PaginatedData<Comment>> =>
  useInfiniteQuery<PaginatedData<Comment>>(
    queryKeys.linkComments(linkId as string),
    (context) => getLinkComments(context.pageParam, linkId as string),
    {
      enabled: !!linkId,
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );
