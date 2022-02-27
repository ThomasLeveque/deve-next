import { Link } from '@data-types/link.type';
import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { PaginatedData } from '@utils/shared-types';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore/lite';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const USER_LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

const getStartAfterDBQuery = (cursor: QueryDocumentSnapshot) => (cursor !== undefined ? [startAfter(cursor)] : []);

const getUserLinks = async (
  cursor: QueryDocumentSnapshot,
  userId: string
): Promise<PaginatedData<Link> | undefined> => {
  try {
    const userLinksRef = collection(db, dbKeys.links);

    const q = query(
      userLinksRef,
      where('postedBy.id', '==', userId),
      orderBy('createdAt', 'desc'),
      ...getStartAfterDBQuery(cursor),
      limit(USER_LINKS_PER_PAGE)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => dataToDocument<Link>(doc));
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

export const useUserLinks = (userId: string | undefined): UseInfiniteQueryResult<PaginatedData<Link> | undefined> =>
  useInfiniteQuery<PaginatedData<Link> | undefined>(
    queryKeys.userLinks(userId as string),
    (context) => getUserLinks(context.pageParam, userId as string),
    {
      enabled: !!userId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
