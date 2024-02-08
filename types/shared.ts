/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ExplicitAny = any;

export type PaginatedData<Data> = {
  data: Data[];
  cursor: number | undefined;
};

export type Nullish<T> = T | null | undefined;

export type ObjectValues<T> = T[keyof T];

export type MaybePromise<T> = Promise<T> | T;
