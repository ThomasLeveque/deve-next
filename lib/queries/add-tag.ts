import { GET_TAGS_SELECT } from '@/lib/constants';
import { createClientClient } from '@/lib/supabase/client';
import { TagInsert } from '@/lib/supabase/types';

export const addTag = async (tagToAdd: TagInsert) => {
  const supabase = createClientClient();
  const response = await supabase.from('tags').insert(tagToAdd).select(GET_TAGS_SELECT).single();
  const newTag = response.data;

  if (!newTag || response.error) {
    throw new Error('Error during adding a new tag, please try again');
  }

  return newTag.id;
};
