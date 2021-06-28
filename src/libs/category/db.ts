import { db } from '@libs/firebase';
import { Document } from '@libs/types';

import { Category } from '@data-types/categorie.type';

import { formatDoc } from '@utils/format-document';

export const getCategories = async (): Promise<Document<Category>[]> => {
  const categoriesRef = db.collection('categories');
  const snapshot = await categoriesRef.get();
  return snapshot.docs.map((doc) => formatDoc<Category>(doc));
};
