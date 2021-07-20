import { DocumentReference } from '@firebase/firestore-types';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { Document } from '@utils/shared-types';

import { queryKeys } from './query-keys';

const addCategory = async (
  categoryRef: DocumentReference,
  category: Category
): Promise<Document<Category>[]> => {
  await categoryRef.set(category);
  return [];
};

export const useAddCategory = (): UseMutationResult<
  Document<Category>[],
  unknown,
  { categoryRef: DocumentReference; category: Category },
  Document<Category>[] | undefined
> => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryRef, category }) => addCategory(categoryRef, category), {
    onMutate: async ({ categoryRef, category }) => {
      const newCategory = { id: categoryRef.id, ...category };

      await queryClient.cancelQueries(queryKeys.categories);

      const previousCategories = queryClient.getQueryData<Document<Category>[]>(
        queryKeys.categories
      );

      queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) => [
        ...(oldCategories ?? []),
        newCategory,
      ]);

      return previousCategories;
    },
    onError: (err, variables, previousCategories) => {
      queryClient.setQueryData(queryKeys.categories, previousCategories);
    },
  });
};