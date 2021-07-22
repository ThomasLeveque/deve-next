import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { OrderLinksKey } from '@hooks/use-query-string';

import { Link } from '@data-types/link.type';

import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { Document, PaginatedData } from '@utils/shared-types';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

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
  link: Document<Link>,
  orderbyQuery: OrderLinksKey,
  tagsQuery: string[]
): UseMutationResult<
  InfiniteData<PaginatedData<Link>>,
  Error,
  Partial<Document<Link>>,
  InfiniteData<PaginatedData<Link>> | undefined
> => {
  const queryClient = useQueryClient();
  const linksKey = queryKeys.links(orderbyQuery, tagsQuery);
  return useMutation(
    (updateLinkData: Partial<Document<Link>>) => updateLink(link.id, updateLinkData),
    {
      onMutate: async (updateLinkData) => {
        const newDocLink: Document<Link> = { ...link, ...updateLinkData };

        await queryClient.cancelQueries(linksKey);

        const previousLinks = queryClient.getQueryData<InfiniteData<PaginatedData<Link>>>(linksKey);

        queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(linksKey, (oldLinks) => {
          if (oldLinks) {
            return updateItemInsidePaginatedData<Link>(newDocLink, oldLinks);
          }
          return {} as InfiniteData<PaginatedData<Link>>;
        });

        return previousLinks;
      },
      onError: (err, newDocLink, previousLinks) => {
        toast.error(formatError(err));
        queryClient.setQueryData(linksKey, previousLinks);
      },
    }
  );
};
