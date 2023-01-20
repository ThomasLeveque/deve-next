import { QueryKey } from '@tanstack/react-query';

export const queryKeys = {
  comments: (linkId: number): QueryKey => ['comments', linkId],
};
