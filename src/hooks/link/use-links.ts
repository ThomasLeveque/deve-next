import { Query, DocumentSnapshot } from '@firebase/firestore-types';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { OrderLinksKey } from '@hooks/useQueryString';

import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';
import { db } from '@utils/init-firebase';
import { PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

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
): Promise<PaginatedData<Link>> => {
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
};

export const useLinks = (
  orderbyQuery: OrderLinksKey,
  tagsQuery: string[]
): UseInfiniteQueryResult<PaginatedData<Link>> =>
  useInfiniteQuery<PaginatedData<Link>>(
    queryKeys.links(orderbyQuery, tagsQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, tagsQuery),
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );
