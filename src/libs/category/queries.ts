import { useQuery, UseQueryResult } from 'react-query';

import { Document } from '@libs/types';

import { Category } from '@data-types/categorie.type';

import { getCategories } from './db';

export const queryKeys = {
  categories: ['categories'],
};

export const useCategories = (): UseQueryResult<Document<Category>[]> =>
  useQuery(queryKeys.categories, () => getCategories());
