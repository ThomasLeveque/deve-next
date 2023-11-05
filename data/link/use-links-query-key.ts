import { useQueryString } from '@/hooks/use-query-string';
import { QueryKey } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { queryKeys } from './query-keys';

export const useLinksQueryKey = (): QueryKey => {
  const pathname = usePathname();
  const params = useSearchParams();

  // TODO: get PROFILE
  const profile = null;

  const { orderbyQuery, searchQuery } = useQueryString();
  const tagSlugParam = params?.get('tagSlug');

  return useMemo(() => {
    switch (pathname) {
      case '/':
        return queryKeys.links(orderbyQuery, searchQuery);
      case '/tags/[tagSlug]':
        return queryKeys.tagLinks(tagSlugParam);
      case '/profil':
        return queryKeys.links(orderbyQuery, searchQuery);
      // return queryKeys.userLinks(profile?.id ?? null);
      default:
        return [];
    }
  }, [pathname, orderbyQuery, searchQuery, profile, tagSlugParam]);
};
