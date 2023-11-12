export type PaginatedData<Data> = {
  data: Data[];
  cursor: number | undefined;
};

export type Nullish<T> = T | null | undefined;

export type ObjectValues<T> = T[keyof T];
