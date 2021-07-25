import { OrderLinksKey } from '@hooks/use-query-string';

export const queryKeys = {
  links: (
    orderbyQuery: OrderLinksKey,
    tagsQuery: string[]
  ): [string, OrderLinksKey, { tags: string[] }] => ['links', orderbyQuery, { tags: tagsQuery }],
  userLinks: (userId: string): string[] => ['user-links', userId],
  linkComments: (linkId: string): string[] => ['link-comments', linkId],
};
