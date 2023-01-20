import { getLinks } from '@api/link/get-links';
import { useQueryString } from '@hooks/use-query-string';
import useDebounce from '@hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

export const useLinks = () => {
  const { orderbyQuery, searchQuery } = useQueryString();
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 500);

  return useInfiniteQuery(
    queryKeys.links(orderbyQuery, debouncedSearchQuery),
    (context) => getLinks(context.pageParam, orderbyQuery, debouncedSearchQuery),
    {
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
};
