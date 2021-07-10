import { InfiniteData } from 'react-query';

import { PaginatedData, Document } from '@libs/types';

export const updateItemInsidePaginatedData = <Data>(
  item: Document<Data>,
  items: InfiniteData<PaginatedData<Data>>
): InfiniteData<PaginatedData<Data>> => {
  const pageIndex = items.pages.findIndex((page) => page.data.find((d) => d.id === item.id));
  const itemIndex = items.pages[pageIndex].data.findIndex((d) => d.id === item.id);
  items.pages[pageIndex].data[itemIndex] = item;
  return items;
};
