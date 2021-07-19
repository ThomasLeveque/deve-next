import { DocumentSnapshot } from '@firebase/firestore-types';

import { Document } from '@utils/shared-types';

export const dataToDocument = <Data>(doc: DocumentSnapshot): Document<Data> => ({
  id: doc.id,
  exists: doc.exists,
  ...(doc.data() as Data),
});
