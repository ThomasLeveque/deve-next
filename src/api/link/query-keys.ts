import { OrderLinksKey } from '@hooks/use-query-string';
import { QueryKey } from 'react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, searchQuery: string): QueryKey => ['supabase-links', orderbyQuery, searchQuery],
  userLinks: (userId: string): QueryKey => ['supabase-user-links', userId],
};
