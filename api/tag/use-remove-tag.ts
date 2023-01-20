import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { removeItemInsideData } from '@utils/mutate-data';
import { GetTagsReturn } from 'api/tag/use-tags';
import toast from 'react-hot-toast';
import { queryKeys } from './query-keys';

export type RemoveTagReturn = Awaited<ReturnType<typeof removeTag>>;

const removeTag = async (tagId: number) => {
  const response = await supabase.from('tags').delete().eq('id', tagId).select('*, links(*)').single();
  const removedTag = response.data;

  if (!removedTag || response.error) {
    throw new Error('Error during removing a tag, please try again');
  }
  return removedTag.id;
};

export const useRemoveTag = (): UseMutationResult<RemoveTagReturn, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation((tagId) => removeTag(tagId), {
    onSuccess: async (removedTagId) => {
      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) => removeItemInsideData(removedTagId, oldTags));
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
