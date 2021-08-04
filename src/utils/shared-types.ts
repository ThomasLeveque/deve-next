import { QueryDocumentSnapshot } from 'firebase/firestore/lite';

export type Document<Data> = Data & {
  id?: string;
  exists?: boolean;
};

export type PaginatedData<Data> = {
  data: Document<Data>[];
  cursor: QueryDocumentSnapshot;
};
