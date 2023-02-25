import { GetTagsReturn } from '@data/tag/get-tags';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { formatError } from '@utils/format-string';
import { removeItemInsideData } from '@utils/mutate-data';
import { supabase } from '@utils/supabase-client';
import toast from 'react-hot-toast';
import { queryKeys } from './utils';

export type RemoveTagReturn = Awaited<ReturnType<typeof removeTag>>;

const removeTag = async (tagId: number) => {
  const response = await supabase.from('tags').delete().eq('id', tagId).select('id').single();
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
      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) =>
        removeItemInsideData([removedTagId], oldTags)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
