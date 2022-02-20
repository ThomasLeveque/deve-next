import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';

import { Tag } from '@models/tag';

import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { addItemInsideData } from '@utils/mutate-data';

import { dbKeys } from './db-keys';
import { queryKeys } from './query-keys';

const addTag = async (tagToAdd: Partial<Tag>): Promise<Tag> => {
  const response = await supabase.from<Tag>(dbKeys.tags).insert(tagToAdd).single();
  const newTag = response.data;

  if (!newTag || response.error) {
    throw new Error('Error during adding a new tag, please try again');
  }
  return newTag;
};

export const useAddTag = (): UseMutationResult<Tag, Error, Partial<Tag>, Tag> => {
  const queryClient = useQueryClient();
  return useMutation((tagToAdd) => addTag(tagToAdd), {
    onSuccess: (newTag) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags, (oldTags) =>
        addItemInsideData(newTag, oldTags, 'end')
      );
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
