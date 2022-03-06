import { Link } from '@models/link';
import { Tag } from '@models/tag';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { addItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, QueryKey, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { LinksTags } from './../../models/link';
import { dbKeys } from './db-keys';

export const addLink = async (linkToAdd: Partial<Link>, tags: Tag[]): Promise<Link> => {
  const { data: newLink, error: newLinkError } = await supabase.from<Link>(dbKeys.links).insert(linkToAdd).single();

  if (!newLink || newLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }

  const { data: newLinksTagsConnection, error: newLinksTagsConnectionError } = await supabase
    .from<LinksTags>(dbKeys.linksTags)
    .insert(
      tags.map((tag) => ({
        linkId: newLink.id,
        tagId: tag.id,
      }))
    );

  if (!newLinksTagsConnection || newLinksTagsConnectionError) {
    await supabase.from<Link>(dbKeys.links).delete().eq('id', newLink.id);
    throw new Error('Error during connecting a link to some tags, please try again');
  }

  newLink.tags = tags;

  return newLink;
};

export const useAddLink = (
  queryKey: QueryKey
): UseMutationResult<Link, Error, { linkToAdd: Partial<Link>; tags: Tag[] }, Link> => {
  const queryClient = useQueryClient();

  return useMutation(({ linkToAdd, tags }) => addLink(linkToAdd, tags), {
    onSuccess: (newLink) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
        addItemInsidePaginatedData(newLink, oldLinks)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
