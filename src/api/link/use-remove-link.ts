import { Comment } from '@models/comment';
import { Link } from '@models/link';
import { Vote } from '@models/vote';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { removeItemInsidePaginatedData } from '@utils/mutate-data';
import { PaginatedData } from '@utils/shared-types';
import toast from 'react-hot-toast';
import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { dbKeys as commentDbKeys } from '../comment/db-keys';
import { queryKeys as tagsQuerykeys } from '../tag/query-keys';
import { LinksTags } from './../../models/link';
import { dbKeys } from './db-keys';
import { useLinksQueryKey } from './use-links-query-key';

export const removeLink = async (linkId: number): Promise<number> => {
  await Promise.all([
    supabase.from<LinksTags>(dbKeys.linksTags).delete().eq('linkId', linkId),
    supabase.from<Vote>(dbKeys.votes).delete().eq('linkId', linkId),
    supabase.from<Comment>(commentDbKeys.comments).delete().eq('linkId', linkId),
  ]);

  const { data: removedLink, error: removedLinkError } = await supabase
    .from<Link>(dbKeys.links)
    .delete()
    .eq('id', linkId)
    .single();

  if (!removedLink || removedLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }

  return removedLink.id;
};

export const useRemoveLink = (): UseMutationResult<number, Error, number, Link> => {
  const queryClient = useQueryClient();

  const queryKey = useLinksQueryKey();

  return useMutation((linkId) => removeLink(linkId), {
    onSuccess: (removedLinkId) => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Link>>>(queryKey, (oldLinks) =>
        removeItemInsidePaginatedData(removedLinkId, oldLinks)
      );

      queryClient.invalidateQueries(tagsQuerykeys);
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
