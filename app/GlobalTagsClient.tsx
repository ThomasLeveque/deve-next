'use client';

import { GetTagsReturn } from '@data/tag/get-tags';
import { queryKeys } from '@data/tag/utils';
import { queryClient } from '@utils/query-client';

export default function GlobalTagsClient({ tags }: { tags: GetTagsReturn }) {
  queryClient.setQueryData(queryKeys.tags, tags);
  return null;
}
