import { DocumentSnapshot, Query } from '@firebase/firestore-types';

import { db } from '@libs/firebase';
import { Document, PaginatedData } from '@libs/types';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { formatDoc } from '@utils/format-document';

const LINKS_PER_PAGE = 20;

export type OrderLinksKey = 'newest' | 'oldest' | 'liked';

const getOrderbyQuery = (linksRef: Query, orderby: OrderLinksKey) => {
  switch (orderby) {
    case 'newest':
      return linksRef.orderBy('createdAt', 'desc');
    case 'oldest':
      return linksRef.orderBy('createdAt', 'asc');
    case 'liked':
      return linksRef.orderBy('voteCount', 'desc');
  }
};

const getTagsQuery = (linksRef: Query, tags: string[]) =>
  tags.length > 0 ? linksRef.where('categories', 'array-contains-any', tags) : linksRef;

export const getLinks = async (
  cursor: DocumentSnapshot,
  orderby: OrderLinksKey,
  tags: string[]
): Promise<PaginatedData<Link>> => {
  const linksRef = db.collection('links');
  const tagsQuery = getTagsQuery(linksRef, tags);
  const orderbyQuery = getOrderbyQuery(tagsQuery, orderby);
  const query = cursor !== undefined ? orderbyQuery.startAfter(cursor) : orderbyQuery;

  const snapshot = await query.limit(LINKS_PER_PAGE).get();
  const data = snapshot.docs.map((doc) => formatDoc<Link>(doc));
  const nextCursor = snapshot.docs[snapshot.docs.length - 1];
  return {
    data,
    cursor: nextCursor,
  };
};

export const getLinkComments = async (linkId: string): Promise<Document<Comment>[]> => {
  const commentsRef = db.collection('links').doc(linkId).collection('comments');
  const snapshot = await commentsRef.get();
  return snapshot.docs.map((doc) => formatDoc<Comment>(doc));
};
