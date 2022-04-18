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
  const tagSlug = typeof router.query.tagSlug === 'string' ? router.query.tagSlug : '';

  return useMemo(() => {
    switch (router.pathname) {
      case '/':
        return queryKeys.links(orderbyQuery, searchQuery);
      case '/tags/[tagSlug]':
        return queryKeys.tagLinks(tagSlug);
      case '/profil':
        return profile ? queryKeys.userLinks(profile.id) : [];
      default:
        return [];
    }
  }, [router.pathname, orderbyQuery, searchQuery, profile, tagSlug]);
};
