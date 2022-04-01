import { useRemoveTag } from '@api/tag/use-remove-tag';
import SpinnerIcon from '@components/icons/spinner-icon';
import { CheckIcon, TrashIcon } from '@heroicons/react/outline';
import { Tag } from '@models/tag';
import { useProfile } from '@store/profile.store';
import classNames from 'classnames';
import React, { useCallback } from 'react';

interface TagsComboboxOptionProps extends React.ReactElement<HTMLLIElement> {
  filteredTag: Tag;
  removeSelectedItem: (tag: Tag) => void;
  active: boolean;
  selected: boolean;
}

const TagsComboboxOption = React.forwardRef<HTMLLIElement, TagsComboboxOptionProps>(
  ({ active, selected, filteredTag, removeSelectedItem, ...props }, ref) => {
    const [profile] = useProfile();
    const removeTag = useRemoveTag();

    const canBeRemove = (filteredTag.links?.length ?? 0) === 0 && profile?.role === 'admin';

    const handleRemoveTag = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        if (canBeRemove) {
          await removeTag.mutateAsync(filteredTag.id);
          removeSelectedItem(filteredTag);
        }
      },
      [canBeRemove, filteredTag, removeSelectedItem, removeTag]
    );

    return (
      <li
        className={classNames(
          `pointer grid w-full grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm hover:bg-primary`,
          { 'bg-primary': active },
          { 'grid-cols-[20px,1fr,20px]': canBeRemove }
        )}
        {...props}
        ref={ref}
      >
        <>
          <span>{selected && <CheckIcon />}</span>
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
