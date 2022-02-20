export type Document<Data> = Data & {
  id?: string;
  exists?: boolean;
};

export type PaginatedData<Data> = {
  data: Data[];
  cursor: number;
};

export type Nullable<T> = T | null | undefined;
