import { ModalsStore, useModalsStore } from '@store/modals.store';
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
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { Document, PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';

const linkToCommentModalSelector = (state: ModalsStore) => state.linkToCommentModal;
const setLinkToCommentModalSelector = (state: ModalsStore) => state.setLinkToCommentModal;

const updateLink = async (
  linkId: string | undefined,
  linkToUpdate: Partial<Document<Link>>
): Promise<InfiniteData<PaginatedData<Link>>> => {
  if (!linkId) {
    throw new Error('This link does not exist');
  }

  const linkRef = db.doc(dbKeys.link(linkId));
  await linkRef.update(linkToUpdate);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const useUpdateLink = (
  prevLink: Document<Link>,
  queryKey: QueryKey
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  Error,
  Partial<Document<Link>>,
  Document<Link>
> => {
  const queryClient = useQueryClient();
  const updateCategory = useUpdateCategory();

  const linkToCommentModal = useModalsStore(linkToCommentModalSelector);
  const setLinkToCommentModal = useModalsStore(setLinkToCommentModalSelector);

  return useMutation(
    (linkToUpdate: Partial<Document<Link>>) => updateLink(prevLink.id, linkToUpdate),
    {
      onMutate: async (linkToUpdate) => {
        await queryClient.cancelQueries(queryKey);

        const newLink: Document<Link> = { ...prevLink, ...linkToUpdate };

        queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
          updateItemInsidePaginatedData<Link>(newLink, oldLinks)
        );

        if (linkToCommentModal) {
          setLinkToCommentModal(newLink);
        }

        return prevLink;
      },
      onSuccess: (data, linkToUpdate, prevLink) => {
        if (linkToUpdate.categories) {
          const tags = queryClient.getQueryData<Document<Category>[]>(categoryQueryKeys.categories);

          const prevTags = prevLink?.categories ?? [];
          const newTags = linkToUpdate.categories;

          prevTags.forEach((prevTag) => {
            const found = newTags.find(
              (newTag) => newTag.toLocaleLowerCase() === prevTag.toLocaleLowerCase()
            );
            if (!found) {
              // Removed item
              const removedItem = tags?.find(
                (tag) => tag.name.toLocaleLowerCase() === prevTag.toLocaleLowerCase()
              );
              if (removedItem) {
                updateCategory.mutate({
                  prevCategory: removedItem,
                  categoryToUpdate: { count: removedItem.count - 1 },
                });
              }
            }
          });

          newTags.forEach((newTag) => {
            const found = prevTags.find(
              (prevTag) => prevTag.toLocaleLowerCase() === newTag.toLocaleLowerCase()
            );
            if (!found) {
              // Added item
              const addedItem = tags?.find(
                (tag) => tag.name.toLocaleLowerCase() === newTag.toLocaleLowerCase()
              );
              if (addedItem) {
                updateCategory.mutate({
                  prevCategory: addedItem,
                  categoryToUpdate: { count: addedItem.count + 1 },
                });
              }
            }
          });
        }
      },
      onError: (err, variables, prevLink) => {
        toast.error(formatError(err));
        if (prevLink) {
          queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
            updateItemInsidePaginatedData<Link>(prevLink, oldLinks)
          );

          if (linkToCommentModal) {
            setLinkToCommentModal(prevLink);
          }
        }
      },
    }
  );
};
