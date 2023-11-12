import { createClientClient } from '@/lib/supabase/client';

export const removeTag = async (tagId: number) => {
  const supabase = createClientClient();
  const response = await supabase.from('tags').delete().eq('id', tagId).select('id').single();
  const removedTag = response.data;

  if (!removedTag || response.error) {
    throw new Error('Error during removing a tag, please try again');
  }

  return removedTag.id;
};
