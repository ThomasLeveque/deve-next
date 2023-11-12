'use client';

import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { destructiveToast } from '@/components/ui/use-toast';
import { removeTagAction } from '@/lib/actions/remove-tag.action';
import { useAction } from '@/lib/actions/use-action';
import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { formatError } from '@/utils/format-string';
import { TrashIcon } from 'lucide-react';

type RemoveTagBtnProps = {
  tag: FetchTagsReturn[number];
  onSuccess: (id: number) => void;
};

export function RemoveTagBtn({ tag, onSuccess }: RemoveTagBtnProps) {
  const [removeTagLoading, triggerRemoveTagAction] = useAction(removeTagAction, {
    onSuccess(removedTagId) {
      onSuccess(removedTagId);
    },
    onError(error) {
      destructiveToast({ description: formatError(error) });
    },
  });

  return (
    <>
      {removeTagLoading ? (
        <SpinnerIcon size={16} />
      ) : (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();

            triggerRemoveTagAction(tag.id);
          }}
          className="ml-auto"
        >
          <TrashIcon size={16} />
        </button>
      )}
    </>
  );
}
