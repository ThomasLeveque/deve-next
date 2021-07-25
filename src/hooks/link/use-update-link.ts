import toast from 'react-hot-toast';
import {
  InfiniteData,
  QueryKey,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

import { Link } from '@data-types/link.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { Document, PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';

const updateLink = async (
  linkId: string | undefined,
  linkToUpdate: Partial<Document<Link>>
): Promise<InfiniteData<PaginatedData<Link>>> => {
  if (!linkId) {
    throw new Error('This link does not exist');
  }

  const linkRef = db.doc(dbKeys.link(linkId));
  await linkRef.update(linkToUpdate);
  return {} as InfiniteData<PaginatedData<Link>>;
};

export const useUpdateLink = (
  prevLink: Document<Link>,
  queryKey: QueryKey
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  Error,
  Partial<Document<Link>>,
  Document<Link>
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (linkToUpdate: Partial<Document<Link>>) => updateLink(prevLink.id, linkToUpdate),
    {
      onMutate: async (linkToUpdate) => {
        await queryClient.cancelQueries(queryKey);

        const newLink: Document<Link> = { ...prevLink, ...linkToUpdate };

        queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
          updateItemInsidePaginatedData<Link>(
            newLink,
            oldLinks ?? ({} as InfiniteData<PaginatedData<Link>>)
          )
        );

        return prevLink;
      },
      onError: (err, variables, prevLink) => {
        toast.error(formatError(err));
        if (prevLink) {
          queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
            updateItemInsidePaginatedData<Link>(
              prevLink,
              oldLinks ?? ({} as InfiniteData<PaginatedData<Link>>)
            )
          );
        }
      },
    }
  );
};
