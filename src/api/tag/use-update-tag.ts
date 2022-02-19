import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Tag } from '@models/tag';

import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsideData } from '@utils/mutate-data';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const updateTag = async (tagId: number, tagToUpdate: Partial<Tag>): Promise<Tag> => {
  const response = await supabase
    .from<Tag>(dbKeys.tags)
    .update(tagToUpdate)
    .eq('id', tagId)
    .single();
  const updatedTag = response.data;

  if (!updatedTag || response.error) {
    throw new Error('Error during updating a tag, please try again');
  }
  return updatedTag;
};

export const useUpdateCategory = (): UseMutationResult<
  Tag,
  Error,
  { tagId: number; tagToUpdate: Partial<Tag> },
  Tag
> => {
  const queryClient = useQueryClient();
  return useMutation(({ tagId, tagToUpdate }) => updateTag(tagId, tagToUpdate), {
    onSuccess: async (updatedTag) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags, (oldTags) =>
        updateItemInsideData<Tag>(updatedTag, oldTags)
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
