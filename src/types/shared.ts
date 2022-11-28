export type PaginatedData<Data> = {
  data: Data[];
  cursor: number | undefined;
};

export type Nullable<T> = T | null | undefined;
