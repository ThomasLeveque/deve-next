import { Tag } from '@models/tag';
import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { removeItemInsideData } from '@utils/mutate-data';
import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const removeTag = async (tagId: number): Promise<number> => {
  const response = await supabase.from<Tag>(dbKeys.tags).delete().eq('id', tagId).single();
  const removedTag = response.data;

  if (!removedTag || response.error) {
    throw new Error('Error during removing a tag, please try again');
  }
  return removedTag.id;
};

export const useRemoveTag = (): UseMutationResult<number, Error, number, Tag> => {
  const queryClient = useQueryClient();
  return useMutation((tagId) => removeTag(tagId), {
    onSuccess: async (removedTagId) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags, (oldTags) => removeItemInsideData<Tag>(removedTagId, oldTags));
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
