import { InfiniteData } from '@tanstack/react-query';
import produce, { Draft } from 'immer';
import { Nullable, PaginatedData } from '~types/shared';

const initialPaginatedData: InfiniteData<never> = {
  pages: [],
  pageParams: [],
};

export const addItemInsidePaginatedData = <TData>(
  item: Draft<TData>,
  items: InfiniteData<PaginatedData<TData>> | undefined,
  pageIndex = 0
): InfiniteData<PaginatedData<TData>> => {
  if (!items?.pages) {
    return initialPaginatedData;
  }

  return produce(items, (newItems) => {
    if (newItems.pages[pageIndex].data) {
      newItems.pages[pageIndex].data.push(item);
    }
  });
};

export const updateItemInsidePaginatedData = <TData extends { id: number }>(
  item: Partial<TData> & { id: number },
  items: InfiniteData<PaginatedData<TData>> | undefined
): InfiniteData<PaginatedData<TData>> => {
  if (!items) {
    return initialPaginatedData;
  }

  return produce(items, (newItems) => {
    const pageIndex = newItems.pages.findIndex((page) => page.data.find((d) => d.id === item.id));
    const itemIndex = newItems.pages[pageIndex].data.findIndex((d) => d.id === item.id);
    const previousItem = newItems.pages[pageIndex].data[itemIndex];
    newItems.pages[pageIndex].data[itemIndex] = { ...previousItem, ...item };
  });
};

export const removeItemInsidePaginatedData = <TData extends { id: number }>(
  itemId: number,
  items: InfiniteData<PaginatedData<TData>> | undefined
): InfiniteData<PaginatedData<TData>> => {
  if (!items) {
    return initialPaginatedData;
  }

  return produce(items, (newItems) => {
    const pageIndex = newItems.pages.findIndex((page) => page.data.find((d) => d.id === itemId));
    const newData = newItems.pages[pageIndex].data.filter((d) => d.id !== itemId);
    newItems.pages[pageIndex].data = newData;
  });
};

export const addItemInsideData = <TData>(
  item: TData,
  items: Nullable<TData[]>,
  newItemPosition: 'start' | 'end' = 'start'
): TData[] => (items ? (newItemPosition === 'start' ? [item, ...items] : [...items, item]) : []);

export const updateItemInsideData = <TData extends { id: number }>(
  item: Partial<TData> & { id: number },
  items: TData[] | undefined
): TData[] => {
  if (!items) return [];

  return produce(items, (newItems) => {
    const itemIndex = newItems.findIndex((i) => i.id === item.id);
    const previousItem = newItems[itemIndex];
    newItems[itemIndex] = { ...previousItem, ...item };
  });
};

export const removeItemInsideData = <TData extends { id: number }>(
  itemId: number,
  items: TData[] | undefined
): TData[] => (items ? items.filter((item) => item.id !== itemId) : []);
