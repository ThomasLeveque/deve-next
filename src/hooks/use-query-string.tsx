import { useRouter } from 'next/router';
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
  const router = useRouter();

  const searchQuery = useMemo(() => {
    return typeof router.query.search !== 'string' ? '' : router.query.search ?? '';
  }, [router.query.search]);

  const orderbyQuery = useMemo(() => {
    return router.query.orderby && orderLinksKeys.includes(router.query.orderby as OrderLinksKey)
      ? (router.query.orderby as OrderLinksKey)
      : 'newest';
  }, [router.query.orderby]);

  const setSearchQuery = (search: string) => {
    let query;
    if (search === '') {
      delete router.query.search;
      query = router.query;
    } else {
      query = { ...router.query, search };
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const setOrderbyQuery = (orderKey: OrderLinksKey) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, orderby: orderKey },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return {
    orderbyQuery,
    searchQuery,
    setOrderbyQuery,
    setSearchQuery,
  };
};
