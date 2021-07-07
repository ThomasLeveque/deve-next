import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQueryClient,
} from 'react-query';

import { PaginatedData, Document } from '@libs/types';

import { OrderLinksKey } from '@hooks/useQueryString';

import { Link } from '@data-types/link.type';

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
) => {
  const queryClient = useQueryClient();
  const linksKey = queryKeys.links(orderbyQuery, tagsQuery);
  return useMutation(
    (updateLinkData: Partial<Document<Link>>) => updateLink(link.id, updateLinkData),
    {
      onMutate: async (updateLinkData) => {
        const newDocLink = { ...link, ...updateLinkData };

        await queryClient.cancelQueries(linksKey);

        const previousLinks = queryClient.getQueryData<InfiniteData<PaginatedData<Link>>>(linksKey);

        queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksKey, (oldLinks) => {
          if (oldLinks) {
            const pageIndex = oldLinks.pages.findIndex((page) =>
              page.data.find((link) => link.id === newDocLink.id)
            );
            const linkIndex = oldLinks.pages[pageIndex].data.findIndex(
              (link) => link.id === newDocLink.id
            );
            oldLinks.pages[pageIndex].data[linkIndex] = newDocLink;
          }
          return oldLinks ?? ({} as InfiniteData<PaginatedData<Link>>);
        });

        return previousLinks;
      },
      onError: (err, newDocLink, previousLinks) => {
        queryClient.setQueryData(linksKey, previousLinks);
      },
    }
  );
};
