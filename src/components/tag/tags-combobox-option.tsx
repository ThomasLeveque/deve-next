import { useRemoveTag } from '@api/tag/use-remove-tag';
import SpinnerIcon from '@components/icons/spinner-icon';
import { Combobox } from '@headlessui/react';
import { CheckIcon, TrashIcon } from '@heroicons/react/outline';
import { Tag } from '@models/tag';
import { useProfile } from '@store/profile.store';
import classNames from 'classnames';
import React, { useCallback } from 'react';

interface TagsComboboxOptionProps {
  selectedTags: Tag[];
  filteredTag: Tag;
  handleRemoveSelectedTags: (tagId: number) => void;
}

const TagsComboboxOption: React.FC<TagsComboboxOptionProps> = ({ filteredTag, handleRemoveSelectedTags }) => {
  const [profile] = useProfile();
  const removeTag = useRemoveTag();

  const canBeRemove = (filteredTag.links?.length ?? 0) === 0 && profile?.role === 'admin';

  const handleRemoveTag = useCallback(
    (tagId: number, canBeRemove: boolean) => {
      return async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        if (canBeRemove) {
          await removeTag.mutateAsync(tagId);
          handleRemoveSelectedTags(tagId);
        }
      };
    },
    [handleRemoveSelectedTags, removeTag]
  );

  return (
    <Combobox.Option
      key={filteredTag.id}
      value={filteredTag}
      className={({ active }) =>
        classNames(
          `pointer grid w-full grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm hover:bg-primary`,
          {
            'bg-primary': active,
          },
          { 'grid-cols-[20px,1fr,20px]': canBeRemove }
        )
      }
    >
      {({ selected }) => (
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
                <button
                  type="button"
                  onClick={handleRemoveTag(filteredTag.id, canBeRemove)}
                  className="rounded-[4px] hover:bg-black/10"
                >
                  <TrashIcon />
                </button>
              )}
            </>
          )}
        </>
      )}
    </Combobox.Option>
  );
};

export default TagsComboboxOption;
