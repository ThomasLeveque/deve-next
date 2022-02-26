import { useQueryString } from '@hooks/use-query-string';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { QueryKey } from 'react-query';
import { queryKeys } from './query-keys';

export const useLinksQueryKey = (userId: string): QueryKey => {
  const router = useRouter();
  const { orderbyQuery, tagsQuery } = useQueryString();

  return useMemo(
    () => (router.pathname === '/' ? queryKeys.links(orderbyQuery, tagsQuery) : queryKeys.userLinks(userId)),
    [router.pathname, orderbyQuery, tagsQuery, userId]
  );
};
