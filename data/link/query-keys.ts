import { OrderLinksKey } from '@hooks/use-query-string';
import { QueryKey } from '@tanstack/react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, searchQuery: string): QueryKey => ['links', orderbyQuery, searchQuery],
  userLinks: (userId: string | null): QueryKey => ['user-links', userId],
  tagLinks: (tagSlug: string | null): QueryKey => ['tag-links', tagSlug],
};
