'use client';

import { Button } from '@/components/ui/button';
import { destructiveToast } from '@/components/ui/use-toast';
import { addTagAction } from '@/lib/actions/add-tag.action';
import { useAction } from '@/lib/actions/use-action';
import { formatError, stringToSlug } from '@/utils/format-string';

type AddTagBtnProps = {
  value: string;
  onSuccess: (id: number) => void;
};

export function AddTagBtn({ value, onSuccess }: AddTagBtnProps) {
  const [addTagLoading, triggerAddTagAction] = useAction(addTagAction, {
    onSuccess(addedTagId) {
      onSuccess(addedTagId);
    },
    onError(error) {
      destructiveToast({ description: formatError(error) });
    },
  });

  return (
    <Button
      isLoading={addTagLoading}
      onClick={() => {
        triggerAddTagAction({
          name: value,
          slug: stringToSlug(value),
        });
      }}
      size="sm"
    >
      Create <span className="mx-1 font-bold">{value}</span>tag
    </Button>
  );
}
