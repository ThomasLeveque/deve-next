import { QueryKey } from 'react-query';

export const queryKeys = {
  comments: (linkId: number): QueryKey => ['comments', linkId],
};
