import { createClientClient } from '@/lib/supabase/client';

export const removeLink = async (linkId: number) => {
  const supabase = createClientClient();
  const { data: removedLink, error: removedLinkError } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .select('id')
    .single();

  if (!removedLink || removedLinkError) {
    throw new Error('Error during adding a new link, please try again');
  }
};
