import { Query, DocumentSnapshot } from '@firebase/firestore-types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useInfiniteQuery, UseInfiniteQueryResult, useQueryClient } from 'react-query';

import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';

import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

export const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

const getOrderbyDBQuery = (linksRef: Query, orderby: OrderLinksKey) => {
  switch (orderby) {
    case 'newest':
      return linksRef.orderBy('createdAt', 'desc');
    case 'oldest':
      return linksRef.orderBy('createdAt', 'asc');
    case 'liked':
      return linksRef.orderBy('voteCount', 'desc');
  }
};

const getTagsDBQuery = (linksRef: Query, tags: string[]) =>
  tags.length > 0 ? linksRef.where('categories', 'array-contains-any', tags) : linksRef;

const getLinks = async (
  cursor: DocumentSnapshot,
  orderby: OrderLinksKey,
  tags: string[]
): Promise<PaginatedData<Link> | undefined> => {
  try {
    const linksRef = db.collection(dbKeys.links);
    const tagsQuery = getTagsDBQuery(linksRef, tags);
    const orderbyQuery = getOrderbyDBQuery(tagsQuery, orderby);
    const query = cursor !== undefined ? orderbyQuery.startAfter(cursor) : orderbyQuery;

    const snapshot = await query.limit(LINKS_PER_PAGE).get();
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
