import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';
import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { Document, PaginatedData } from '@utils/shared-types';
import { collection, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore/lite';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

export const getFirebaseLinkComments = async (linkId: string): Promise<Document<Comment>[] | undefined> => {
  const commentsRef = collection(db, dbKeys.comments(linkId));
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => dataToDocument<Comment>(doc));
};

const getLinkComments = async (
  cursor: QueryDocumentSnapshot,
  linkId: string
): Promise<PaginatedData<Comment> | undefined> => {
  try {
    const commentsRef = collection(db, dbKeys.comments(linkId));

    const q =
      cursor !== undefined
        ? query(commentsRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(COMMENTS_PER_PAGE))
        : query(commentsRef, orderBy('createdAt', 'desc'), limit(COMMENTS_PER_PAGE));

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => dataToDocument<Comment>(doc));
    const nextCursor = snapshot.docs[snapshot.docs.length - 1];
    return {
      data,
      cursor: nextCursor,
    };
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);
  }
};

export const useLinkComments = (
  link: Document<Link> | null
): UseInfiniteQueryResult<PaginatedData<Comment> | undefined> => {
  const linkId = link?.id;
  return useInfiniteQuery<PaginatedData<Comment> | undefined>(
    queryKeys.linkComments(linkId as string),
    (context) => getLinkComments(context.pageParam, linkId as string),
    {
      enabled: !!linkId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
