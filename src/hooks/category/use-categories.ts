import { useQuery, UseQueryResult } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { dataToDocument } from '@utils/format-document';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const getCategories = async (): Promise<Document<Category>[]> => {
  const categoriesRef = db.collection(dbKeys.categories);
  const snapshot = await categoriesRef.orderBy('count', 'desc').get();
  return snapshot.docs.map((doc) => dataToDocument<Category>(doc));
};

export const useCategories = (): UseQueryResult<Document<Category>[]> =>
  useQuery(queryKeys.categories, () => getCategories());
