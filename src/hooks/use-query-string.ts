import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const TAGS_QUERY_SEPARATOR = '|';
export const orderLinksKeys: OrderLinksKey[] = ['newest', 'oldest', 'liked'];

export type OrderLinksKey = 'newest' | 'oldest' | 'liked';

interface useQueryStringReturn {
  tagsQuery: string[];
  orderbyQuery: OrderLinksKey;
  updateOrderbyQuery: (orderKey: OrderLinksKey) => void;
  addTagQuery: (name: string) => void;
  removeTagQuery: (name: string) => void;
  clearTagQuery: () => void;
}

export const useQueryString = (): useQueryStringReturn => {
  const router = useRouter();

  const tagsQuery = useMemo(
    () => (router.query.tags ? router.query.tags.toString().split(TAGS_QUERY_SEPARATOR) : []),
    [router.query.tags]
  );

  const orderbyQuery = useMemo(
    () =>
      router.query.orderby && orderLinksKeys.includes(router.query.orderby as OrderLinksKey)
        ? (router.query.orderby as OrderLinksKey)
        : 'newest',
    [router.query.orderby]
  );

  const updateOrderbyQuery = (orderKey: OrderLinksKey) => {
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

  const addTagQuery = (name: string) => {
    if (tagsQuery.length === 10 || tagsQuery.includes(name)) {
      return;
    }

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          tags: [...tagsQuery, name].join(TAGS_QUERY_SEPARATOR),
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const clearTagQuery = () => {
    delete router.query.tags;
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const removeTagQuery = (name: string) => {
    if (tagsQuery.length === 1) {
      clearTagQuery();
    } else {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            tags: tagsQuery.filter((tag) => tag !== name).join(TAGS_QUERY_SEPARATOR),
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  };

  return {
    tagsQuery,
    orderbyQuery,
    updateOrderbyQuery,
    addTagQuery,
    removeTagQuery,
    clearTagQuery,
  };
};
