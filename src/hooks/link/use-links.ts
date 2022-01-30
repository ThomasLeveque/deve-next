import {
  query,
  QueryDocumentSnapshot,
  where,
  orderBy,
  limit,
  getDocs,
  collection,
  startAfter,
} from 'firebase/firestore/lite';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult, useQueryClient } from 'react-query';

import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';

import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { PaginatedData, Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

export const getFirebaseLinks = async (): Promise<Document<Link[]> | undefined> => {
  const LinksRef = collection(db, 'links');
  const q = query(LinksRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => dataToDocument<Link>(doc));
};

const getOrderbyDBQuery = (orderby: OrderLinksKey) => {
  switch (orderby) {
    case 'newest':
      return [orderBy('createdAt', 'desc')];
    case 'oldest':
      return [orderBy('createdAt', 'asc')];
    case 'liked':
      return [orderBy('voteCount', 'desc'), orderBy('createdAt', 'desc')];
  }
};

const getTagsDBQuery = (tags: string[]) =>
  tags.length > 0 ? [where('categories', 'array-contains-any', tags)] : [];

const getStartAfterDBQuery = (cursor: QueryDocumentSnapshot) =>
  cursor !== undefined ? [startAfter(cursor)] : [];

const getLinks = async (
  cursor: QueryDocumentSnapshot,
  orderby: OrderLinksKey,
  tags: string[]
): Promise<PaginatedData<Link> | undefined> => {
  try {
    const linksRef = collection(db, dbKeys.links);

    const q = query(
      linksRef,
      ...getTagsDBQuery(tags),
      ...getOrderbyDBQuery(orderby),
      ...getStartAfterDBQuery(cursor),
      limit(LINKS_PER_PAGE)
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

export const useLinks = (): UseInfiniteQueryResult<PaginatedData<Link> | undefined> => {
  const { tagsQuery, orderbyQuery } = useQueryString();
  return useInfiniteQuery<PaginatedData<Link> | undefined>(
    queryKeys.links(orderbyQuery, tagsQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, tagsQuery),
    {
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};

export const usePrefetchLinks = (): void => {
  const queryClient = useQueryClient();
  const { tagsQuery, orderbyQuery } = useQueryString();
  useEffect(() => {
    queryClient.prefetchInfiniteQuery(queryKeys.links(orderbyQuery, tagsQuery), (context) =>
      getLinks(context.pageParam, orderbyQuery, tagsQuery)
    );
  }, []);
};
