import SpinnerIcon from '@components/icons/spinner-icon';
import { useSupabase } from '@components/SupabaseAuthProvider';
import { GetTagsReturn } from '@data/tag/get-tags';
import { useRemoveTag } from '@data/tag/use-remove-tag';
import { TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@utils/cn';
import { singleToArray } from '@utils/single-to-array';
import React, { useCallback } from 'react';

interface TagsComboboxOptionProps extends React.HTMLAttributes<HTMLLIElement> {
  filteredTag: GetTagsReturn[0];
  active: boolean;
}

const TagsComboboxOption = React.forwardRef<HTMLLIElement, TagsComboboxOptionProps>(
  ({ active, filteredTag, ...props }, ref) => {
    const { profile } = useSupabase();
    const removeTag = useRemoveTag();

    const tagLinks = singleToArray(filteredTag.links);

    const canBeRemove = (tagLinks.length ?? 0) === 0 && profile?.role === 'admin';

    const handleRemoveTag = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        if (canBeRemove) {
          await removeTag.mutateAsync(filteredTag.id);
        }
      },
      [canBeRemove, filteredTag, removeTag]
    );

    return (
      <li
        className={cn(
          `pointer grid w-full gap-3 px-4 py-2 text-sm hover:bg-primary`,
          { 'bg-primary': active },
          { 'grid-cols-[1fr,20px]': canBeRemove }
        )}
        {...props}
        ref={ref}
      >
        <>
          <p className="text-left">
            {filteredTag.name} ({tagLinks.length ?? 0})
          </p>

          {canBeRemove && (
            <>
              {removeTag.isLoading ? (
                <SpinnerIcon />
              ) : (
                <button type="button" onClick={handleRemoveTag} className="rounded-[4px] hover:bg-black/10">
                  <TrashIcon />
                </button>
              )}
            </>
          )}
        </>
      </li>
    );
  }
);

export default TagsComboboxOption;
