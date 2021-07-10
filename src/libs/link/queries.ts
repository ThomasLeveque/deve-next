import { DocumentReference } from '@firebase/firestore-types';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

import { PaginatedData, Document } from '@libs/types';

import { OrderLinksKey } from '@hooks/useQueryString';

import { Link } from '@data-types/link.type';

import { addItemToPaginatedData, updateItemInsidePaginatedData } from '@utils/queries';

import { addLink, getLinks, updateLink } from './db';

export const queryKeys = {
  links: (
    orderbyQuery: OrderLinksKey,
    tagsQuery: string[]
  ): [string, OrderLinksKey, { tags: string[] }] => ['links', orderbyQuery, { tags: tagsQuery }],
  linkComments: (linkId: string): string[] => ['link-comments', linkId],
};

export const useLinks = (
  orderbyQuery: OrderLinksKey,
  tagsQuery: string[]
): UseInfiniteQueryResult<PaginatedData<Link>> =>
  useInfiniteQuery<PaginatedData<Link>>(
    queryKeys.links(orderbyQuery, tagsQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, tagsQuery),
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );

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
      const newLink = { id: linkRef.id, ...link };

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

export const useUpdateLink = (
  link: Document<Link>,
  orderbyQuery: OrderLinksKey,
  tagsQuery: string[]
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  unknown,
  Partial<Document<Link>>,
  InfiniteData<PaginatedData<Link>> | undefined
> => {
  const queryClient = useQueryClient();
  const linksKey = queryKeys.links(orderbyQuery, tagsQuery);
  return useMutation(
    (updateLinkData: Partial<Document<Link>>) => updateLink(link.id, updateLinkData),
    {
      onMutate: async (updateLinkData) => {
        const newDocLink: Document<Link> = { ...link, ...updateLinkData };

        await queryClient.cancelQueries(linksKey);

        const previousLinks = queryClient.getQueryData<InfiniteData<PaginatedData<Link>>>(linksKey);

        queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksKey, (oldLinks) => {
          if (oldLinks) {
            return updateItemInsidePaginatedData<Link>(newDocLink, oldLinks);
          }
          return {} as InfiniteData<PaginatedData<Link>>;
        });

        return previousLinks;
      },
      onError: (err, newDocLink, previousLinks) => {
        queryClient.setQueryData(linksKey, previousLinks);
      },
    }
  );
};
