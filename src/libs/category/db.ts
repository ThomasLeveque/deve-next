import { DocumentReference } from '@firebase/firestore-types';

import { db } from '@libs/firebase';
import { Document } from '@libs/types';

import { Category } from '@data-types/categorie.type';

import { dataToDocument } from '@utils/format-document';

export const CATEGORIES_COLLECTION_KEY = 'categories';

export const getCategories = async (): Promise<Document<Category>[]> => {
  const categoriesRef = db.collection(CATEGORIES_COLLECTION_KEY);
  const snapshot = await categoriesRef.orderBy('count', 'desc').get();
  return snapshot.docs.map((doc) => dataToDocument<Category>(doc));
};

export const addCategory = async (
  categoryRef: DocumentReference,
  category: Category
): Promise<Document<Category>[]> => {
  await categoryRef.set(category);
  return [];
};

export const updateCategory = async (
  categoryId: string | undefined,
  categoryToUpdate: Partial<Document<Category>>
): Promise<Document<Category>[]> => {
  const categoryRef = db.collection(CATEGORIES_COLLECTION_KEY).doc(categoryId);
  await categoryRef.update(categoryToUpdate);
  return [];
};
