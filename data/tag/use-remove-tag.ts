import { useToast } from '@/components/ui/use-toast';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { createClientClient } from '@/lib/supabase/client';
import { formatError } from '@/utils/format-string';
import { removeItemInsideData } from '@/utils/mutate-data';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './utils';

export type RemoveTagReturn = Awaited<ReturnType<typeof removeTag>>;

const removeTag = async (tagId: number) => {
  const supabase = createClientClient();
  const response = await supabase.from('tags').delete().eq('id', tagId).select('id').single();
  const removedTag = response.data;

  if (!removedTag || response.error) {
    throw new Error('Error during removing a tag, please try again');
  }
  return removedTag.id;
};

export const useRemoveTag = (): UseMutationResult<RemoveTagReturn, Error, number> => {
  const { destructiveToast } = useToast();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId) => removeTag(tagId),
    onSuccess: async (removedTagId) => {
      queryClient.setQueryData<GetTagsReturn>(queryKeys.tags, (oldTags) =>
        removeItemInsideData([removedTagId], oldTags)
      );
    },
    onError: (err) => {
      destructiveToast({ description: formatError(err) });
    },
  });
};
