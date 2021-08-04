import { collection, orderBy, getDocs, query } from 'firebase/firestore/lite';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { dataToDocument } from '@utils/format-document';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const getCategories = async (): Promise<Document<Category>[] | undefined> => {
  try {
    const categoriesRef = collection(db, dbKeys.categories);
    const q = query(categoriesRef, orderBy('count', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => dataToDocument<Category>(doc));
  } catch (err) {
    toast.error(formatError(err));
    console.error(err);
  }
};

export const useCategories = (
  options?: UseQueryOptions<Document<Category>[] | undefined>
): UseQueryResult<Document<Category>[] | undefined> =>
  useQuery(queryKeys.categories, () => getCategories(), options);

export const usePrefetchCategories = (): void => {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(queryKeys.categories, () => getCategories());
  }, []);
};
