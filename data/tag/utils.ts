import { FetchTagsReturn } from '@data/tag/get-tags';
import { singleToArray } from '@utils/single-to-array';

export const GET_TAGS_SELECT = '*, links(id)';

export const queryKeys = {
  tags: ['tags'],
} as const;

export function formatTagWithLinksCount(tag: NonNullable<FetchTagsReturn>[number]) {
  return {
    ...tag,
    linksCount: singleToArray(tag.links).length,
  };
}
