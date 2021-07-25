import { DocumentSnapshot } from '@firebase/firestore-types';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { PaginatedData } from '@utils/shared-types';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

const getLinkComments = async (
  cursor: DocumentSnapshot,
  linkId: string
): Promise<PaginatedData<Comment> | undefined> => {
  try {
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
  } catch (err) {
    toast.error(formatError(err));
    console.error(err);
  }
};

export const useLinkComments = (
  link: Document<Link> | null
): UseInfiniteQueryResult<PaginatedData<Comment> | undefined> => {
  const linkId = link?.id;
  const commentCount = link?.commentCount ?? 0;
  return useInfiniteQuery<PaginatedData<Comment> | undefined>(
    queryKeys.linkComments(linkId as string),
    (context) => getLinkComments(context.pageParam, linkId as string),
    {
      enabled: !!linkId && commentCount > 0,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
