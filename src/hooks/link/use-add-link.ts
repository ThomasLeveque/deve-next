import { DocumentReference } from '@firebase/firestore-types';
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
import { addItemInsidePaginatedData, removeItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData, Document } from '@utils/shared-types';

export const addLink = async (
  linkRef: DocumentReference,
  link: Link
): Promise<InfiniteData<PaginatedData<Link>>> => {
  await linkRef.set(link);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const useAddLink = (
  queryKey: QueryKey
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  Error,
  { linkRef: DocumentReference; link: Link },
  Document<Link>
> => {
  const queryClient = useQueryClient();
  const updateCategory = useUpdateCategory();

  return useMutation(({ linkRef, link }) => addLink(linkRef, link), {
    onMutate: async ({ linkRef, link }) => {
      const newLink: Document<Link> = { id: linkRef.id, ...link };

      await queryClient.cancelQueries(queryKey);

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
        addItemInsidePaginatedData(newLink, oldLinks)
      );

      return newLink;
    },
    onSuccess: (data, variables, newLink) => {
      // Increment count of every used tags
      const tags = queryClient.getQueryData<Document<Category>[]>(categoryQueryKeys.categories);
      newLink?.categories.forEach((selectedTag) => {
        const prevTag = tags?.find(
          (tag) => tag.name.toLocaleLowerCase() === selectedTag.toLocaleLowerCase()
        );

        if (prevTag) {
          updateCategory.mutate({
            prevCategory: prevTag,
            categoryToUpdate: { count: prevTag.count + 1 },
          });
        }
      });
    },
    onError: (err, variables, newLink) => {
      toast.error(formatError(err));
      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
        removeItemInsidePaginatedData(newLink?.id as string, oldLinks)
      );
    },
  });
};
