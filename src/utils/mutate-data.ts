import { InfiniteData } from 'react-query';

import { PaginatedData, Document } from '@utils/shared-types';

const initialPaginatedData = {
  pages: [],
  pageParams: [],
};

export const addItemInsidePaginatedData = <Data>(
  item: Document<Data>,
  items: InfiniteData<PaginatedData<Data>> | undefined,
  pageIndex = 0
): InfiniteData<PaginatedData<Data>> => {
  if (!items) {
    return initialPaginatedData;
  }

  const currentPageData = items.pages[pageIndex].data;
  items.pages[pageIndex].data = [item, ...currentPageData];
  return items;
};

export const updateItemInsidePaginatedData = <Data>(
  item: Document<Data>,
  items: InfiniteData<PaginatedData<Data>> | undefined
): InfiniteData<PaginatedData<Data>> => {
  if (!items) {
    return initialPaginatedData;
  }

  const pageIndex = items.pages.findIndex((page) => page.data.find((d) => d.id === item.id));
  const itemIndex = items.pages[pageIndex].data.findIndex((d) => d.id === item.id);
  items.pages[pageIndex].data[itemIndex] = item;
  return items;
};

export const removeItemInsidePaginatedData = <Data>(
  itemId: string,
  items: InfiniteData<PaginatedData<Data>> | undefined
): InfiniteData<PaginatedData<Data>> => {
  if (!items) {
    return initialPaginatedData;
  }

  const pageIndex = items.pages.findIndex((page) => page.data.find((d) => d.id === itemId));
  const newData = items.pages[pageIndex].data.filter((d) => d.id !== itemId);
  items.pages[pageIndex].data = newData;
  return items;
};

export const addItemInsideData = <Data>(
  item: Document<Data>,
  items: Document<Data>[] | undefined,
  newItemPosition: 'start' | 'end' = 'start'
): Document<Data>[] =>
  items ? (newItemPosition === 'start' ? [item, ...items] : [...items, item]) : [];

export const updateItemInsideData = <Data>(
  item: Document<Data>,
  items: Document<Data>[] | undefined
): Document<Data>[] => {
  if (!items) return [];

  const itemIndex = items.findIndex((i) => i.id === item.id);
  items[itemIndex] = item;
  return items;
};

export const removeItemInsideData = <Data>(
  itemId: string,
  items: Document<Data>[] | undefined
): Document<Data>[] => (items ? items.filter((item) => item.id !== itemId) : []);
