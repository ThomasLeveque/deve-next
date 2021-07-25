import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { addItemInsideData, removeItemInsideData } from '@utils/mutate-data';
import { Document } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const removeCategory = async (categoryId: string): Promise<Document<Category>[]> => {
  const categoryRef = db.collection(dbKeys.categories).doc(categoryId);
  await categoryRef.delete();
  return [];
};

export const useRemoveCategory = (): UseMutationResult<
  Document<Category>[],
  Error,
  Document<Category>,
  Document<Category>
> => {
  const queryClient = useQueryClient();
  return useMutation((category) => removeCategory(category.id as string), {
    onMutate: async (category) => {
      await queryClient.cancelQueries(queryKeys.categories);

      queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
        removeItemInsideData<Category>(category.id as string, oldCategories ?? [])
      );

      return category;
    },
    onError: (err, variables, removedCategory) => {
      toast.error(formatError(err));
      if (removedCategory) {
        queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
          addItemInsideData<Category>(removedCategory, oldCategories ?? [], 'end')
        );
      }
    },
  });
};
