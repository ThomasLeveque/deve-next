import { Link } from '@models/link';
import { Tag } from '@models/tag';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { queryKeys as tagsQuerykeys } from '../tag/query-keys';
import { LinksTags } from './../../models/link';
import { dbKeys } from './db-keys';
import { useLinksQueryKey } from './use-links-query-key';

type UpdateLinkReturn = { updatedLink: Link; shouldRevalidateTags: boolean };

export const updateLink = async (
  linkId: number,
  linkToUpdate: Partial<Link>,
  tags: Tag[]
): Promise<UpdateLinkReturn> => {
  const { data: updatedLink, error: updatedLinkError } = await supabase
    .from<Link>(dbKeys.links)
    .update(linkToUpdate)
    .eq('id', linkId)
    .select(`*, tags(*)`)
    .single();

  if (!updatedLink || updatedLinkError) {
    throw new Error('Error during updating a link, please try again');
  }

  const linksTagsToRemove = updatedLink.tags?.filter((tag) => !tags.map((t) => t.id)?.includes(tag.id));
  const shouldRemovelinksTags = linksTagsToRemove && linksTagsToRemove.length > 0;
  if (shouldRemovelinksTags) {
    try {
      await Promise.all(
        linksTagsToRemove.map((tag) =>
          supabase.from<LinksTags>(dbKeys.linksTags).delete().match({
            tagId: tag.id,
            linkId: updatedLink.id,
          })
        )
      );
    } catch (err) {
      toast.error(formatError(new Error('Error during updating the tags of this link, please try again')));
    }
  }

  const linksTagsToAdd = tags?.filter((tag) => !updatedLink.tags?.map((t) => t.id)?.includes(tag.id));
  const shouldAddlinksTags = Boolean(linksTagsToAdd && linksTagsToAdd.length > 0);
  if (shouldAddlinksTags) {
    const { error: linksTagsToAddError } = await supabase.from<LinksTags>(dbKeys.linksTags).insert(
      linksTagsToAdd.map((tag) => ({
        linkId: updatedLink.id,
        tagId: tag.id,
      }))
    );

    if (linksTagsToAddError) {
      throw new Error('Error during updating the tags of this link, please try again');
    }
  }

  updatedLink.tags = tags;

  return { updatedLink, shouldRevalidateTags: shouldAddlinksTags || Boolean(shouldRemovelinksTags) };
};

export const useUpdateLink = (): UseMutationResult<
  UpdateLinkReturn,
  Error,
  { linkId: number; linkToUpdate: Partial<Link>; tags: Tag[] },
  Link
> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation(({ linkId, linkToUpdate, tags }) => updateLink(linkId, linkToUpdate, tags), {
    onSuccess: ({ updatedLink, shouldRevalidateTags }) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
        updateItemInsidePaginatedData(updatedLink, oldLinks)
      );

      if (shouldRevalidateTags) {
        console.log('shouldRevalidateTags');
        queryClient.invalidateQueries(tagsQuerykeys);
      }
    },
  });
};
