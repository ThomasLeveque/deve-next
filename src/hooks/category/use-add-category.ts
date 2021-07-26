import { DocumentReference } from '@firebase/firestore-types';
import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { formatError } from '@utils/format-string';
import { addItemInsideData, removeItemInsideData } from '@utils/mutate-data';
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
  Error,
  { categoryRef: DocumentReference; category: Category },
  Document<Category>
> => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryRef, category }) => addCategory(categoryRef, category), {
    onMutate: async ({ categoryRef, category }) => {
      await queryClient.cancelQueries(queryKeys.categories);

      const newCategory = { id: categoryRef.id, ...category };

      queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
        addItemInsideData(newCategory, oldCategories, 'end')
      );

      return newCategory;
    },
    onError: (err, variables, newCategory) => {
      toast.error(formatError(err));
      queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
        removeItemInsideData(newCategory?.id as string, oldCategories)
      );
    },
  });
};
