import { DocumentSnapshot } from '@firebase/firestore-types';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const USER_LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

const getUserLinks = async (
  cursor: DocumentSnapshot,
  userId: string
): Promise<PaginatedData<Link> | undefined> => {
  try {
    const userlinksRef = db.collection(dbKeys.links);
    const whereQuery = userlinksRef.where('postedBy.id', '==', userId);
    const orderbyQuery = whereQuery.orderBy('createdAt', 'desc');
    const query = cursor !== undefined ? orderbyQuery.startAfter(cursor) : orderbyQuery;

    const snapshot = await query.limit(USER_LINKS_PER_PAGE).get();
    const data = snapshot.docs.map((doc) => dataToDocument<Link>(doc));
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

export const useUserLinks = (
  userId: string | undefined
): UseInfiniteQueryResult<PaginatedData<Link> | undefined> =>
  useInfiniteQuery<PaginatedData<Link> | undefined>(
    queryKeys.userLinks(userId as string),
    (context) => getUserLinks(context.pageParam, userId as string),
    {
      enabled: !!userId,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
