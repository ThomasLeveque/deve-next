import { createClientClient } from '@/lib/supabase/client';
import { FetchTagsReturn } from '@/lib/supabase/queries/fetch-tags';
import { Database } from '@/types/supabase';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

type LinkInsert = Database['public']['Tables']['links']['Insert'];
export type AddLinkReturn = Awaited<ReturnType<typeof addLink>>;

export const addLink = async (linkToAdd: LinkInsert, tags: FetchTagsReturn = []) => {
  const supabase = createClientClient();
  const { data: newLink, error: newLinkError } = await supabase
    .from('links')
    .insert(linkToAdd)
    .select(
      `
      *,
      user:profiles(*),
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
  { linkToAdd: LinkInsert; tags: FetchTagsReturn }
> => {
  return useMutation({
    mutationFn: ({ linkToAdd, tags }) => addLink(linkToAdd, tags),
  });
};
