import { Document } from '@utils/shared-types';
import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore/lite';

export const dataToDocument = <Data>(doc: QueryDocumentSnapshot | DocumentSnapshot): Document<Data> => ({
  id: doc.id,
  exists: doc.exists(),
  ...(doc.data() as Data),
});
