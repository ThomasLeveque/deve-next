import { DocumentSnapshot, Query } from '@firebase/firestore-types';
import { InfiniteData } from 'react-query';

import { db } from '@libs/firebase';
import { Document, PaginatedData } from '@libs/types';

import { OrderLinksKey } from '@hooks/useQueryString';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';

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

export const getLinks = async (
  cursor: DocumentSnapshot,
  orderby: OrderLinksKey,
  tags: string[]
): Promise<PaginatedData<Link>> => {
  const linksRef = db.collection('links');
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

export const updateLink = async (
  linkId: string | undefined,
  linkToUpdate: Partial<Document<Link>>
): Promise<InfiniteData<PaginatedData<Link>>> => {
  const linkRef = db.collection('links').doc(linkId);
  await linkRef.update(linkToUpdate);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const getLinkComments = async (linkId: string): Promise<Document<Comment>[]> => {
  const commentsRef = db.collection('links').doc(linkId).collection('comments');
  const snapshot = await commentsRef.get();
  return snapshot.docs.map((doc) => dataToDocument<Comment>(doc));
};
