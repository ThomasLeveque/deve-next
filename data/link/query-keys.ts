import { OrderLinksKey } from '@/hooks/use-query-string';
import { Nullable } from '@/types/shared';
import { QueryKey } from '@tanstack/react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, searchQuery: string): QueryKey => ['links', orderbyQuery, searchQuery],
  userLinks: (userId: Nullable<string>): QueryKey => ['user-links', userId],
  tagLinks: (tagSlug: Nullable<string>): QueryKey => ['tag-links', tagSlug],
};
