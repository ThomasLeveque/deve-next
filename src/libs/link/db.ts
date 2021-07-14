import { DocumentSnapshot, Query, DocumentReference } from '@firebase/firestore-types';
import { InfiniteData } from 'react-query';

import { CATEGORIES_COLLECTION_KEY } from '@libs/category/db';
import { db } from '@libs/firebase';
import { Document, PaginatedData } from '@libs/types';

import { OrderLinksKey } from '@hooks/useQueryString';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { dataToDocument } from '@utils/format-document';

export const LINKS_COLLECTION_KEY = 'links';
export const COMMENTS_COLLECTION_KEY = 'comments';

const LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;
const COMMENTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE) ?? 20;

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
  tags.length > 0
    ? linksRef.where(CATEGORIES_COLLECTION_KEY, 'array-contains-any', tags)
    : linksRef;

export const getLinks = async (
  cursor: DocumentSnapshot,
  orderby: OrderLinksKey,
  tags: string[]
): Promise<PaginatedData<Link>> => {
  const linksRef = db.collection(LINKS_COLLECTION_KEY);
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
  const linkRef = db.collection(LINKS_COLLECTION_KEY).doc(linkId);
  await linkRef.update(linkToUpdate);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const addLink = async (
  linkRef: DocumentReference,
  link: Link
): Promise<InfiniteData<PaginatedData<Link>>> => {
  await linkRef.set(link);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const getLinkComments = async (
  cursor: DocumentSnapshot,
  linkId: string
): Promise<PaginatedData<Comment>> => {
  const commentsRef = db
    .collection(LINKS_COLLECTION_KEY)
    .doc(linkId)
    .collection(COMMENTS_COLLECTION_KEY);

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

export const addLinkComment = async (
  commentRef: DocumentReference,
  comment: Comment
): Promise<InfiniteData<PaginatedData<Comment>>> => {
  await commentRef.set(comment);
  return {} as InfiniteData<PaginatedData<Comment>>;
};
