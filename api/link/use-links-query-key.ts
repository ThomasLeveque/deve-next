import { useSupabase } from '@components/SupabaseAuthProvider';
import { useQueryString } from '@hooks/use-query-string';
import { QueryKey } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { queryKeys } from './query-keys';

export const useLinksQueryKey = (): QueryKey => {
  const pathname = usePathname();
  const params = useSearchParams();
  const { profile } = useSupabase();
  const { orderbyQuery, searchQuery } = useQueryString();
  const tagSlugParam = params.get('tagSlug');
  const tagSlug = tagSlugParam === 'string' ? tagSlugParam : '';

  return useMemo(() => {
    switch (pathname) {
      case '/':
        return queryKeys.links(orderbyQuery, searchQuery);
      case '/tags/[tagSlug]':
        return queryKeys.tagLinks(tagSlug);
      case '/profil':
        return profile ? queryKeys.userLinks(profile.id) : [];
      default:
        return [];
    }
  }, [pathname, orderbyQuery, searchQuery, profile, tagSlug]);
};
