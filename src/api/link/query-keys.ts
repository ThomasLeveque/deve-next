import { OrderLinksKey } from '@hooks/use-query-string';
import { QueryKey } from 'react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, searchQuery: string): QueryKey => ['links', orderbyQuery, searchQuery],
  userLinks: (userId: string): QueryKey => ['user-links', userId],
  tagLinks: (tagSlug: string): QueryKey => ['tag-links', tagSlug],
};
