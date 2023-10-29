import { Nullish, PaginatedData } from '@/types/shared';
import { InfiniteData } from '@tanstack/react-query';
import { Draft, produce } from 'immer';

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
    if (newItems.pages[pageIndex]?.data) {
      newItems.pages[pageIndex]?.data.push(item);
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
    const itemIndex = newItems.pages[pageIndex]?.data.findIndex((d) => d.id === item.id);

    if (!itemIndex || !pageIndex) {
      return newItems;
    }

    const previousItem = newItems.pages[pageIndex]?.data[itemIndex];

    if (previousItem) {
      newItems.pages[pageIndex]!.data[itemIndex] = { ...previousItem, ...item };
    }
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
    const newData = newItems.pages[pageIndex]?.data.filter((d) => d.id !== itemId);
    if (newData && newItems.pages[pageIndex]?.data) {
      newItems.pages[pageIndex]!.data = newData;
    }
  });
};

export const addItemInsideData = <TData>(
  item: TData,
  items: Nullish<TData[]>,
  newItemPosition: 'start' | 'end' = 'start'
): TData[] => (items ? (newItemPosition === 'start' ? [item, ...items] : [...items, item]) : []);

export const updateItemsInsideData = <TData extends { id: number }>(
  itemsToUpdate: Partial<TData>[],
  items: TData[] | undefined
): TData[] => {
  if (!items) return [];

  return produce(items, (newItems) => {
    itemsToUpdate.forEach((item) => {
      const itemIndex = newItems.findIndex((i) => i.id === item.id);
      const previousItem = newItems[itemIndex];

      if (previousItem) {
        newItems[itemIndex] = { ...previousItem, ...item };
      }
    });
  });
};

export const removeItemInsideData = <TData extends { id: number }>(
  itemIds: number[],
  items: TData[] | undefined
): TData[] => (items ? items.filter((item) => !itemIds.includes(item.id)) : []);
