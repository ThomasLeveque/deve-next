import { QueryDocumentSnapshot, DocumentSnapshot } from 'firebase/firestore/lite';

import { Document } from '@utils/shared-types';

export const dataToDocument = <Data>(
  doc: QueryDocumentSnapshot | DocumentSnapshot
): Document<Data> => ({
  id: doc.id,
  exists: doc.exists(),
  ...(doc.data() as Data),
});
