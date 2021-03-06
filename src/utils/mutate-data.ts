import { Nullable, PaginatedData } from '@utils/shared-types';
import { InfiniteData } from 'react-query';

const initialPaginatedData = {
  pages: [],
  pageParams: [],
};

export const addItemInsidePaginatedData = <DataType>(
  item: DataType,
  items: InfiniteData<PaginatedData<DataType>> | undefined,
  pageIndex = 0
): InfiniteData<PaginatedData<DataType>> => {
  if (!items) {
    return initialPaginatedData;
  }

  const currentPageData = items.pages[pageIndex] ? items.pages[pageIndex].data : [];
  if (items.pages[pageIndex]) {
    items.pages[pageIndex].data = [item, ...currentPageData];
  }
  return items;
};

export const updateItemInsidePaginatedData = <DataType extends { id: number }>(
  item: Partial<DataType> & { id: number },
  items: InfiniteData<PaginatedData<DataType>> | undefined
): InfiniteData<PaginatedData<DataType>> => {
  if (!items) {
    return initialPaginatedData;
  }

  const pageIndex = items.pages.findIndex((page) => page.data.find((d) => d.id === item.id));
  const itemIndex = items.pages[pageIndex].data.findIndex((d) => d.id === item.id);
  const previousItem = items.pages[pageIndex].data[itemIndex];
  items.pages[pageIndex].data[itemIndex] = { ...previousItem, ...item };
  return items;
};

export const removeItemInsidePaginatedData = <DataType extends { id: number }>(
  itemId: number,
  items: InfiniteData<PaginatedData<DataType>> | undefined
): InfiniteData<PaginatedData<DataType>> => {
  if (!items) {
    return initialPaginatedData;
  }

  const pageIndex = items.pages.findIndex((page) => page.data.find((d) => d.id === itemId));
  const newData = items.pages[pageIndex].data.filter((d) => d.id !== itemId);
  items.pages[pageIndex].data = newData;
  return items;
};

export const addItemInsideData = <DataType>(
  item: DataType,
  items: Nullable<DataType[]>,
  newItemPosition: 'start' | 'end' = 'start'
): DataType[] => (items ? (newItemPosition === 'start' ? [item, ...items] : [...items, item]) : []);

export const updateItemInsideData = <DataType extends { id: number }>(
  item: Partial<DataType> & { id: number },
  items: DataType[] | undefined
): DataType[] => {
  if (!items) return [];

  const itemIndex = items.findIndex((i) => i.id === item.id);
  const previousItem = items[itemIndex];
  items[itemIndex] = { ...previousItem, ...item };
  return items;
};

export const removeItemInsideData = <DataType extends { id: number }>(
  itemId: number,
  items: DataType[] | undefined
): DataType[] => (items ? items.filter((item) => item.id !== itemId) : []);
