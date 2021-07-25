import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { updateItemInsideData } from '@utils/mutate-data';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const updateCategory = async (
  categoryId: string | undefined,
  categoryToUpdate: Partial<Document<Category>>
): Promise<Document<Category>[]> => {
  const categoryRef = db.collection(dbKeys.categories).doc(categoryId);
  await categoryRef.update(categoryToUpdate);
  return [];
};

export const useUpdateCategory = (): UseMutationResult<
  Document<Category>[],
  Error,
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

        const previousCategories = [
          ...(queryClient.getQueryData<Document<Category>[]>(queryKeys.categories) ?? []),
        ];
        queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
          updateItemInsideData<Category>(newDocCategory, oldCategories ?? [])
        );

        return previousCategories;
      },
      onError: (err, variables, previousCategories) => {
        toast.error(formatError(err));
        queryClient.setQueryData(queryKeys.categories, previousCategories);
      },
    }
  );
};
