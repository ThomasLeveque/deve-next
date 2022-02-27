import { OrderLinksKey } from '@hooks/use-query-string';
import { QueryKey } from 'react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, tagsQuery: string[]): QueryKey => [
    'supabase-links',
    orderbyQuery,
    { tags: tagsQuery },
  ],
  userLinks: (userId: string): QueryKey => ['supabase-user-links', userId],
};
