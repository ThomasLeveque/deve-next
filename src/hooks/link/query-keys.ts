import { OrderLinksKey } from '@hooks/useQueryString';

export const queryKeys = {
  links: (
    orderbyQuery: OrderLinksKey,
    tagsQuery: string[]
  ): [string, OrderLinksKey, { tags: string[] }] => ['links', orderbyQuery, { tags: tagsQuery }],
  linkComments: (linkId: string): string[] => ['link-comments', linkId],
};
