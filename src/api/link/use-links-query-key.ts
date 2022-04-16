import { useQueryString } from '@hooks/use-query-string';
import { useProfile } from '@store/profile.store';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { QueryKey } from 'react-query';
import { queryKeys } from './query-keys';

export const useLinksQueryKey = (): QueryKey => {
  const router = useRouter();
  const profile = useProfile()[0];
  const { orderbyQuery, searchQuery } = useQueryString();

  return useMemo(
    () =>
      router.pathname === '/'
        ? queryKeys.links(orderbyQuery, searchQuery)
        : profile
        ? queryKeys.userLinks(profile.id)
        : [],
    [router.pathname, orderbyQuery, searchQuery, profile]
  );
};
