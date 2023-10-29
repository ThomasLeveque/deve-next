export type PaginatedData<Data> = {
  data: Data[];
  cursor: number | undefined;
};

export type Nullish<T> = T | null | undefined;
