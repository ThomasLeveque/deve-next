import { GET_TAGS_SELECT } from '@/lib/constants';
import { createClientClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type AddTagReturn = Awaited<ReturnType<typeof addTag>>;

const addTag = async (tagToAdd: TagInsert) => {
  const supabase = createClientClient();
  const response = await supabase.from('tags').insert(tagToAdd).select(GET_TAGS_SELECT).single();
  const newTag = response.data;

  if (!newTag || response.error) {
    throw new Error('Error during adding a new tag, please try again');
  }
  return newTag;
};

export const useAddTag = (): UseMutationResult<AddTagReturn, Error, TagInsert> => {
  return useMutation({
    mutationFn: (tagToAdd) => addTag(tagToAdd),
  });
};
