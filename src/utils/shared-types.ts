export type PaginatedData<Data> = {
  data: Data[];
  cursor: Nullable<number>;
};

export type Nullable<T> = T | null | undefined;
