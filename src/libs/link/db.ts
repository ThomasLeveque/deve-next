import { DocumentSnapshot } from '@firebase/firestore-types';

import { db } from '@libs/firebase';
import { Document, PaginatedData } from '@libs/types';

import { Comment } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { formatDoc } from '@utils/format-document';

const LINKS_PER_PAGE = 2;

export const getLinks = async (cursor: DocumentSnapshot): Promise<PaginatedData<Link>> => {
  const linksRef = db.collection('links');
  const orderQuery = linksRef.orderBy('createdAt', 'desc');
  const query = cursor !== undefined ? orderQuery.startAfter(cursor) : orderQuery;

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
