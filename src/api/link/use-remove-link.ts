import { doc, deleteDoc } from 'firebase/firestore/lite';
import toast from 'react-hot-toast';
import {
  InfiniteData,
  QueryKey,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

import { queryKeys as categoryQueryKeys } from '@hooks/category/query-keys';
import { useUpdateCategory } from '@hooks/category/use-update-category';

import { Category } from '@data-types/categorie.type';
import { Link } from '@data-types/link.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { removeItemInsidePaginatedData, addItemInsidePaginatedData } from '@utils/mutate-data';
import { Document, PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';

const removeLink = async (linkId: string): Promise<InfiniteData<PaginatedData<Link>>> => {
  const linkRef = doc(db, dbKeys.link(linkId));
  await deleteDoc(linkRef);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const useRemoveLink = (
  queryKey: QueryKey
): UseMutationResult<InfiniteData<PaginatedData<Link>>, Error, Document<Link>, Document<Link>> => {
  const queryClient = useQueryClient();
  const updateCategory = useUpdateCategory();

  return useMutation((link) => removeLink(link.id as string), {
    onMutate: async (link) => {
      await queryClient.cancelQueries(queryKey);

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
        removeItemInsidePaginatedData(link.id as string, oldLinks)
      );

      return link;
    },
    onSuccess: (data, variables, removedLink) => {
      // Decrement count of every used tags
      const tags = queryClient.getQueryData<Document<Category>[]>(categoryQueryKeys.categories);
      removedLink?.categories.forEach((selectedTag) => {
        const prevTag = tags?.find(
          (tag) => tag.name.toLocaleLowerCase() === selectedTag.toLocaleLowerCase()
        );

        if (prevTag) {
          updateCategory.mutate({
            prevCategory: prevTag,
            categoryToUpdate: { count: prevTag.count - 1 },
          });
        }
      });
    },
    onError: (err, variables, removedLink) => {
      toast.error(formatError(err as Error));
      if (removedLink) {
        queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
          addItemInsidePaginatedData(removedLink, oldLinks)
        );
      }
    },
  });
};
