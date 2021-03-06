import { InformationCircleIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';

export const TAGS_QUERY_SEPARATOR = '|';
export const orderLinksKeys: OrderLinksKey[] = ['newest', 'oldest', 'liked'];

export type OrderLinksKey = 'newest' | 'oldest' | 'liked';

interface useQueryStringReturn {
  tagsQuery: string[];
  orderbyQuery: OrderLinksKey;
  searchQuery: string;
  setOrderbyQuery: (orderKey: OrderLinksKey) => void;
  setSearchQuery: (search: string) => void;
  addTagQuery: (name: string) => void;
  removeTagQuery: (name: string) => void;
  clearTagQuery: () => void;
}

export const useQueryString = (): useQueryStringReturn => {
  const router = useRouter();

  const searchQuery = useMemo(() => {
    return typeof router.query.search !== 'string' ? '' : router.query.search ?? '';
  }, [router.query.search]);

  const tagsQuery = useMemo(() => {
    return router.query.tags ? router.query.tags.toString().split(TAGS_QUERY_SEPARATOR) : [];
  }, [router.query.tags]);

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

  const addTagQuery = (name: string) => {
    if (tagsQuery.length === 10) {
      toast('No more than 10 filter tags', {
        className: 'Info',
        icon: <InformationCircleIcon />,
      });
      return;
    }

    if (tagsQuery.includes(name)) {
      toast('this is already used', {
        className: 'Info',
        icon: <InformationCircleIcon />,
      });
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
    searchQuery,
    setOrderbyQuery,
    setSearchQuery,
    addTagQuery,
    removeTagQuery,
    clearTagQuery,
  };
};
