import { OrderLinksKey } from '@/hooks/use-query-string';
import { Nullish } from '@/types/shared';
import { QueryKey } from '@tanstack/react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, searchQuery: string): QueryKey => ['links', orderbyQuery, searchQuery],
  userLinks: (userId: Nullish<string>): QueryKey => ['user-links', userId],
  tagLinks: (tagSlug: Nullish<string>): QueryKey => ['tag-links', tagSlug],
};
