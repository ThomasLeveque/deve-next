import { ObjectValues } from '@/types/shared';
import { parseAsInteger } from 'next-usequerystate';

export const pageParser = parseAsInteger.withDefault(1);

export const SEARCH_PARAM = 'q';
export const ORDERBY_PARAM = 'orderby';

export const orderLinksKeys = {
  newest: 'newest',
  oldest: 'oldest',
  liked: 'liked',
} as const;

export type OrderLinksKey = ObjectValues<typeof orderLinksKeys>;

export const GET_TAGS_SELECT = '*, links(id)' as const;
