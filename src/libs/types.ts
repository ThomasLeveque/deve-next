import { DocumentSnapshot } from '@firebase/firestore-types';

export type Document<Data> = Data & {
  id?: string;
  exists?: boolean;
};

export type PaginatedData<Data> = {
  data: Document<Data>[];
  cursor: DocumentSnapshot;
};
