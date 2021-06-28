import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

import { PaginatedData } from '@libs/types';

import { Link } from '@data-types/link.type';

import { getLinks } from './db';

export const queryKeys = {
  links: ['links'],
  linkComments: (linkId: string): string[] => ['link-comments', linkId],
};

export const useLinks = (): UseInfiniteQueryResult<PaginatedData<Link>> =>
  useInfiniteQuery<PaginatedData<Link>>(queryKeys.links, (context) => getLinks(context.pageParam), {
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
