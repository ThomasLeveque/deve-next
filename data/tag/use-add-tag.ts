import { GetTagsReturn } from '@data/tag/use-tags';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { addItemInsideData } from '@utils/mutate-data';
import { supabase } from '@utils/supabase-client';
import { Database } from '~types/supabase';
import { queryKeys } from './query-keys';

type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type AddTagReturn = Awaited<ReturnType<typeof addTag>>;

const addTag = async (tagToAdd: TagInsert) => {
  const response = await supabase.from('tags').insert(tagToAdd).select('*, links(*)').single();
  const newTag = response.data;

  if (!newTag || response.error) {
    throw new Error('Error during adding a new tag, please try again');
  }
  return newTag;
};

export const useAddTag = (): UseMutationResult<AddTagReturn, Error, TagInsert> => {
  const queryClient = useQueryClient();
  return useMutation((tagToAdd) => addTag(tagToAdd), {
    onSuccess: (newTag) => {
      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) => addItemInsideData(newTag, oldTags, 'end'));
    },
  });
};