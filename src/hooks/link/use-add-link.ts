import { DocumentReference } from '@firebase/firestore-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { queryKeys as categoryQueryKeys } from '@hooks/category/query-keys';
import { useUpdateCategory } from '@hooks/category/use-update-category';
import { OrderLinksKey } from '@hooks/use-query-string';

import { Category } from '@data-types/categorie.type';
import { Link } from '@data-types/link.type';

import { formatError } from '@utils/format-string';
import { addItemToPaginatedData } from '@utils/mutate-data';
import { PaginatedData, Document } from '@utils/shared-types';

import { queryKeys } from './query-keys';

export const addLink = async (
  linkRef: DocumentReference,
  link: Link
): Promise<InfiniteData<PaginatedData<Link>>> => {
  await linkRef.set(link);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const useAddLink = (
  orderbyQuery: OrderLinksKey,
  tagsQuery: string[],
  selectedTags: string[]
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  Error,
  { linkRef: DocumentReference; link: Link },
  InfiniteData<PaginatedData<Link>> | undefined
> => {
  const queryClient = useQueryClient();
  const linksKey = queryKeys.links(orderbyQuery, tagsQuery);
  const updateCategory = useUpdateCategory();

  return useMutation(({ linkRef, link }) => addLink(linkRef, link), {
    onMutate: async ({ linkRef, link }) => {
      const newLink: Document<Link> = { id: linkRef.id, ...link };

      await queryClient.cancelQueries(linksKey);

      const previousLinks = queryClient.getQueryData<InfiniteData<PaginatedData<Link>>>(linksKey);

      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksKey, (oldLinks) => {
        if (oldLinks) {
          return addItemToPaginatedData(newLink, oldLinks);
        }
        return {} as InfiniteData<PaginatedData<Link>>;
      });

      return previousLinks;
    },
    onSuccess: () => {
      const tags = queryClient.getQueryData<Document<Category>[]>(categoryQueryKeys.categories);
      selectedTags.forEach((selectedTag) => {
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
    onError: (err, variables, previousLinks) => {
      toast.error(formatError(err));
      queryClient.setQueryData(linksKey, previousLinks);
    },
  });
};
