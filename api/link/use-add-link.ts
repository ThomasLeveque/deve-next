import { GetLinksReturn } from '@api/link/get-links';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { addItemInsidePaginatedData } from '@utils/mutate-data';
import { supabase } from '@utils/supabase-client';
import { GetTagsReturn } from 'api/tag/use-tags';
import { Database } from '~types/supabase';
import { useLinksQueryKey } from './use-links-query-key';

type LinkInsert = Database['public']['Tables']['links']['Insert'];
export type AddLinkReturn = Awaited<ReturnType<typeof addLink>>;

export const addLink = async (linkToAdd: LinkInsert, tags: GetTagsReturn = []) => {
  const { data: newLink, error: newLinkError } = await supabase
    .from('links')
    .insert(linkToAdd)
    .select(
      `
  *,
  user:profiles!links_userId_fkey(*),
  tags(*),
  comments(*),
  votes(*)
`
    )
    .single();

  if (!newLink || newLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }

  const { data: newLinksTagsConnection, error: newLinksTagsConnectionError } = await supabase
    .from('links_tags')
    .insert(
      tags.map((tag) => ({
        linkId: newLink.id,
        tagId: tag.id,
      }))
    )
    .select('id');

  if (!newLinksTagsConnection || newLinksTagsConnectionError) {
    await supabase.from('links').delete().eq('id', newLink.id);
    throw new Error('Error during connecting a link to some tags, please try again');
  }

  newLink.tags = tags;

  return newLink;
};

export const useAddLink = (): UseMutationResult<
  AddLinkReturn,
  Error,
  { linkToAdd: LinkInsert; tags: GetTagsReturn }
> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation(({ linkToAdd, tags }) => addLink(linkToAdd, tags), {
    onSuccess: (newLink) => {
      queryClient.setQueryData<InfiniteData<GetLinksReturn>>(queryKey, (oldLinks) =>
        addItemInsidePaginatedData(newLink, oldLinks)
      );
    },
  });
};
