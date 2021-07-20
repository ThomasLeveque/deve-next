import { DocumentReference } from '@firebase/firestore-types';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { OrderLinksKey } from '@hooks/use-query-string';

import { Link } from '@data-types/link.type';

import { addItemToPaginatedData } from '@utils/mutate-data';
import { PaginatedData, Document } from '@utils/shared-types';

import { queryKeys } from './query-keys';

const addLink = async (
  linkRef: DocumentReference,
  link: Link
): Promise<InfiniteData<PaginatedData<Link>>> => {
  await linkRef.set(link);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const useAddLink = (
  orderbyQuery: OrderLinksKey,
  tagsQuery: string[]
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  unknown,
  { linkRef: DocumentReference; link: Link },
  InfiniteData<PaginatedData<Link>> | undefined
> => {
  const queryClient = useQueryClient();
  const linksKey = queryKeys.links(orderbyQuery, tagsQuery);
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
    onError: (err, variables, previousLinks) => {
      queryClient.setQueryData(linksKey, previousLinks);
    },
  });
};
