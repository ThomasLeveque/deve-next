import { createClientClient } from '@/lib/supabase/client';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export type RemoveLinkReturn = Awaited<ReturnType<typeof removeLink>>;

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

  return { linkId: removedLink.id };
};

export const useRemoveLink = (): UseMutationResult<RemoveLinkReturn, Error, number> => {
  return useMutation({
    mutationFn: (linkId) => removeLink(linkId),
  });
};
