import { OrderLinksKey } from '@hooks/use-query-string';
import { QueryKey } from 'react-query';

export const queryKeys = {
  links: (orderbyQuery: OrderLinksKey, tagsQuery: string[]): QueryKey => ['links', orderbyQuery, { tags: tagsQuery }],
  userLinks: (userId: string): QueryKey => ['user-links', userId],
  linkComments: (linkId: string): QueryKey => ['link-comments', linkId],
};
