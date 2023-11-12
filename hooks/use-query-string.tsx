import { ORDERBY_PARAM, OrderLinksKey, SEARCH_PARAM, orderLinksKeys } from '@/lib/constants';
import { objectValues } from '@/utils/object-values';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface useQueryStringReturn {
  orderbyQuery: OrderLinksKey;
  searchQuery: string;
  setOrderbyQuery: (orderKey: OrderLinksKey) => void;
  setSearchQuery: (search: string | null) => void;
}

export const useQueryString = (): useQueryStringReturn => {
  const nextParams = useSearchParams();
  const router = useRouter();

  const params = new URLSearchParams(nextParams?.toString());

  const [searchQuery, setSearchQuery] = useQueryState(
    SEARCH_PARAM,
    parseAsString.withOptions({
      history: 'replace',
      shallow: false,
      throttleMs: 200,
    })
  );

  const orderbyParam = params.get(ORDERBY_PARAM);

  const orderbyQuery = useMemo(() => {
    return orderbyParam && objectValues(orderLinksKeys).includes(orderbyParam as OrderLinksKey)
      ? (orderbyParam as OrderLinksKey)
      : 'newest';
  }, [orderbyParam]);

  const setOrderbyQuery = (orderKey: OrderLinksKey) => {
    params.set(ORDERBY_PARAM, orderKey);
    router.replace(`?${params.toString()}`);
  };

  return {
    orderbyQuery,
    searchQuery: searchQuery ?? '',
    setOrderbyQuery,
    setSearchQuery,
  };
};
