import { useCustomRouter } from '@hooks/useCustomRouter';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const TAGS_QUERY_SEPARATOR = '|';
export const orderLinksKeys: OrderLinksKey[] = ['newest', 'oldest', 'liked'];

export type OrderLinksKey = 'newest' | 'oldest' | 'liked';

interface useQueryStringReturn {
  orderbyQuery: OrderLinksKey;
  searchQuery: string;
  setOrderbyQuery: (orderKey: OrderLinksKey) => void;
  setSearchQuery: (search: string) => void;
}

export const useQueryString = (): useQueryStringReturn => {
  const nextParams = useSearchParams();
  const router = useCustomRouter();

  const params = new URLSearchParams(nextParams.toString());

  const searchParam = params.get('search');
  const orderbyParam = params.get('orderby');

  const searchQuery = useMemo(() => {
    return typeof searchParam !== 'string' ? '' : searchParam ?? '';
  }, [searchParam]);

  const orderbyQuery = useMemo(() => {
    return orderbyParam && orderLinksKeys.includes(orderbyParam as OrderLinksKey)
      ? (orderbyParam as OrderLinksKey)
      : 'newest';
  }, [orderbyParam]);

  const setSearchQuery = (search: string) => {
    if (search === '') {
      params.delete('search');
    } else {
      params.set('search', search);
    }
    router.push(`?${params.toString()}`);
  };

  const setOrderbyQuery = (orderKey: OrderLinksKey) => {
    params.set('orderby', orderKey);
    router.push(`?${params.toString()}`);
  };

  return {
    orderbyQuery,
    searchQuery,
    setOrderbyQuery,
    setSearchQuery,
  };
};
