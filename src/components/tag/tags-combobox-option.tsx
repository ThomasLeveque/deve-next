import { useRemoveTag } from '@api/tag/use-remove-tag';
import SpinnerIcon from '@components/icons/spinner-icon';
import { TrashIcon } from '@heroicons/react/outline';
import { Tag } from '@models/tag';
import { useProfile } from '@store/profile.store';
import classNames from 'classnames';
import React, { useCallback } from 'react';

interface TagsComboboxOptionProps extends React.ReactElement<HTMLLIElement> {
  filteredTag: Tag;
  active: boolean;
}

const TagsComboboxOption = React.forwardRef<HTMLLIElement, TagsComboboxOptionProps>(
  ({ active, filteredTag, ...props }, ref) => {
    const [profile] = useProfile();
    const removeTag = useRemoveTag();

    const canBeRemove = (filteredTag.links?.length ?? 0) === 0 && profile?.role === 'admin';

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
        className={classNames(
          `pointer grid w-full gap-3 px-4 py-2 text-sm hover:bg-primary`,
          { 'bg-primary': active },
          { 'grid-cols-[1fr,20px]': canBeRemove }
        )}
        {...props}
        ref={ref}
      >
        <>
          <p className="text-left">
            {filteredTag.name} ({filteredTag.links?.length ?? 0})
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
