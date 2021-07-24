import { InfiniteData } from 'react-query';

import { PaginatedData, Document } from '@utils/shared-types';

export const updateItemInsidePaginatedData = <Data>(
  item: Document<Data>,
  items: InfiniteData<PaginatedData<Data>>
): InfiniteData<PaginatedData<Data>> => {
  const pageIndex = items.pages.findIndex((page) => page.data.find((d) => d.id === item.id));
  const itemIndex = items.pages[pageIndex].data.findIndex((d) => d.id === item.id);
  items.pages[pageIndex].data[itemIndex] = item;
  return items;
};

export const updateItemInsideData = <Data>(
  item: Document<Data>,
  items: Document<Data>[]
): Document<Data>[] => {
  const itemIndex = items.findIndex((i) => i.id === item.id);
  items[itemIndex] = item;
  return items;
};

export const removeItemInsideData = <Data>(
  itemId: string,
  items: Document<Data>[]
): Document<Data>[] => items.filter((item) => item.id !== itemId);

export const addItemToPaginatedData = <Data>(
  item: Document<Data>,
  items: InfiniteData<PaginatedData<Data>>,
  pageIndex = 0
): InfiniteData<PaginatedData<Data>> => {
  const currentPageData = items.pages[pageIndex].data;
  items.pages[pageIndex].data = [item, ...currentPageData];
  return items;
};
