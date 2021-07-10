import { DocumentReference } from '@firebase/firestore-types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';

import { Document } from '@libs/types';

import { Category } from '@data-types/categorie.type';

import { updateItemInsideData } from '@utils/queries';

import { addCategory, getCategories, updateCategory } from './db';

export const queryKeys = {
  categories: ['categories'],
};

export const useCategories = (): UseQueryResult<Document<Category>[]> =>
  useQuery(queryKeys.categories, () => getCategories());

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

export const useUpdateCategory = (): UseMutationResult<
  Document<Category>[],
  unknown,
  { prevCategory: Document<Category>; categoryToUpdate: Partial<Document<Category>> },
  Document<Category>[] | undefined
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ prevCategory, categoryToUpdate }) => updateCategory(prevCategory.id, categoryToUpdate),
    {
      onMutate: async ({ prevCategory, categoryToUpdate }) => {
        const newDocCategory: Document<Category> = { ...prevCategory, ...categoryToUpdate };

        await queryClient.cancelQueries(queryKeys.categories);

        const previousCategories = queryClient.getQueryData<Document<Category>[]>(
          queryKeys.categories
        );

        queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
          updateItemInsideData<Category>(newDocCategory, oldCategories ?? [])
        );

        return previousCategories;
      },
      onError: (err, variables, previousCategories) => {
        queryClient.setQueryData(queryKeys.categories, previousCategories);
      },
    }
  );
};
