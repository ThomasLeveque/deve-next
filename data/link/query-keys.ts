import { OrderLinksKey } from '@hooks/use-query-string';
import { QueryKey } from '@tanstack/react-query';
import { Nullable } from '~types/shared';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, searchQuery: string): QueryKey => ['links', orderbyQuery, searchQuery],
  userLinks: (userId: Nullable<string>): QueryKey => ['user-links', userId],
  tagLinks: (tagSlug: Nullable<string>): QueryKey => ['tag-links', tagSlug],
};
