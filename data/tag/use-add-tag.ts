import { GetTagsReturn } from '@/data/tag/get-tags';
import { formatTagWithLinksCount, GET_TAGS_SELECT } from '@/data/tag/utils';
import { Database } from '@/types/supabase';
import { addItemInsideData } from '@/utils/mutate-data';
import { supabase } from '@/utils/supabase-client';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './utils';

type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type AddTagReturn = Awaited<ReturnType<typeof addTag>>;

const addTag = async (tagToAdd: TagInsert) => {
  const response = await supabase.from('tags').insert(tagToAdd).select(GET_TAGS_SELECT).single();
  const newTag = response.data;

  if (!newTag || response.error) {
    throw new Error('Error during adding a new tag, please try again');
  }
  return formatTagWithLinksCount(newTag);
};

export const useAddTag = (): UseMutationResult<AddTagReturn, Error, TagInsert> => {
  const queryClient = useQueryClient();
  return useMutation((tagToAdd) => addTag(tagToAdd), {
    onSuccess: (newTag) => {
      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) => addItemInsideData(newTag, oldTags, 'end'));
    },
  });
};
