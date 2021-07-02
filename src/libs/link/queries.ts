import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { PaginatedData } from '@libs/types';

import { Link } from '@data-types/link.type';

import { getLinks, OrderLinksKey } from './db';

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
