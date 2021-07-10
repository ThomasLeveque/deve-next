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

import { updateItemInsidePaginatedData } from '@utils/queries';

import { getLinks, updateLink } from './db';

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
