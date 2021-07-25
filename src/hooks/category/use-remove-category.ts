import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Category } from '@data-types/categorie.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { removeItemInsideData } from '@utils/mutate-data';
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
  string,
  Document<Category>[] | undefined
> => {
  const queryClient = useQueryClient();
  return useMutation((categoryId) => removeCategory(categoryId), {
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries(queryKeys.categories);

      const previousCategories = [
        ...(queryClient.getQueryData<Document<Category>[]>(queryKeys.categories) ?? []),
      ];

      queryClient.setQueryData<Document<Category>[]>(queryKeys.categories, (oldCategories) =>
        removeItemInsideData<Category>(categoryId, oldCategories ?? [])
      );

      return previousCategories;
    },
    onError: (err, variables, previousCategories) => {
      toast.error(formatError(err));
      queryClient.setQueryData(queryKeys.categories, previousCategories);
    },
  });
};
