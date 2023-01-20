import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import { updateItemInsideData } from '@utils/mutate-data';
import { GetTagsReturn } from 'api/tag/use-tags';
import toast from 'react-hot-toast';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Database } from '~types/supabase';
import { queryKeys } from './query-keys';

type TagUpdate = Database['public']['Tables']['tags']['Update'];
export type UpdateTagReturn = Awaited<ReturnType<typeof updateTag>>;

const updateTag = async (tagId: number, tagToUpdate: TagUpdate) => {
  const response = await supabase.from('tags').update(tagToUpdate).eq('id', tagId).select().single();
  const updatedTag = response.data;

  if (!updatedTag || response.error) {
    throw new Error('Error during updating a tag, please try again');
  }
  return updatedTag;
};

export const useUpdateTag = (): UseMutationResult<
  UpdateTagReturn,
  Error,
  { tagId: number; tagToUpdate: TagUpdate }
> => {
  const queryClient = useQueryClient();
  return useMutation(({ tagId, tagToUpdate }) => updateTag(tagId, tagToUpdate), {
    onSuccess: async (updatedTag) => {
      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) => updateItemInsideData(updatedTag, oldTags));
    },
    onError: (err) => {
      toast.error(formatError(err));
    },
  });
};
