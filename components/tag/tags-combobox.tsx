import SpinnerIcon from '@/components/icons/spinner-icon';
import TagListWrapper from '@/components/tag/tag-list-wrapper';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { useAddTag } from '@/data/tag/use-add-tag';
import { useTags } from '@/data/tag/use-tags';
import { formatError, stringToSlug } from '@/utils/format-string';
import { Transition } from '@headlessui/react';
import { ChevronUpDownIcon, InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCombobox, useMultipleSelection } from 'downshift';
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import TagItem from './tag-item';
import TagsComboboxOption from './tags-combobox-option';

const MAX_TAGS_LENGTH = 4;

interface TagsComboboxProps {
  selectedTags: GetTagsReturn;
  setSelectedTags: (tags: GetTagsReturn) => void;
  className?: string;
  errorText?: string;
}

const TagsCombobox: React.FC<TagsComboboxProps> = ({ selectedTags = [], setSelectedTags, className, errorText }) => {
  const [query, setQuery] = useState('');
  const addTag = useAddTag();

  const { data: tags } = useTags();

  const isTagExist = useMemo(
    () => !!tags?.find((tag) => tag.name.toLocaleLowerCase() === query.toLocaleLowerCase()),
    [tags, query]
  );

  const { getSelectedItemProps, getDropdownProps, addSelectedItem, removeSelectedItem, selectedItems } =
    useMultipleSelection({
      initialSelectedItems: selectedTags,
      onSelectedItemsChange: ({ selectedItems }) => {
        if (selectedItems) {
          setSelectedTags(selectedItems);
        }
      },
    });

  const getFilteredTags = useMemo(
    () =>
      tags?.filter(
        (tag) =>
          !selectedItems.find((selectedItem) => selectedItem.id === tag.id) &&
          tag.name.toLowerCase().includes(query.toLowerCase())
      ),
    [tags, query, selectedItems]
  );

  const { isOpen, getToggleButtonProps, getLabelProps, getMenuProps, getInputProps, highlightedIndex, getItemProps } =
    useCombobox({
      inputValue: query,
      defaultHighlightedIndex: 0,
      selectedItem: null,
      items: getFilteredTags ?? [],
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges;
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // keep the menu open after selection.
            };
        }
        return changes;
      },
      onStateChange: ({ inputValue, type, selectedItem }) => {
        switch (type) {
          case useCombobox.stateChangeTypes.InputChange:
            setQuery(inputValue ?? '');
            break;
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            if (!selectedItem) {
              break;
            }

            handleAddSelectedItem(selectedItem);
            break;
          default:
            break;
        }
      },
    });

  const handleAddSelectedItem = useCallback(
    (tag: GetTagsReturn[0]) => {
      if (selectedItems.length >= MAX_TAGS_LENGTH) {
        toast('No more than 4 tags', {
          className: 'Info',
          icon: <InformationCircleIcon />,
        });
        return;
      }
      setQuery('');
      addSelectedItem(tag);
    },
    [selectedItems.length, addSelectedItem]
  );

  const handleAddTag = useCallback(async () => {
    try {
      const tagName = query.trim();
      const newTag = await addTag.mutateAsync({
        name: tagName,
        slug: stringToSlug(tagName),
      });
      handleAddSelectedItem(newTag);
    } catch (err) {
      toast.error(formatError(err as Error));
    }
  }, [query, addTag, handleAddSelectedItem]);

  return (
    <div className={className}>
      <label {...getLabelProps()} className="mb-[6px] ml-1 block text-[10px] font-bold uppercase text-black">
        TAGS (MIN 1, MAX 4)
      </label>
      {selectedItems.length > 0 && (
        <TagListWrapper className="mb-4">
          {selectedItems.map((selectedItem, index) => (
            <li key={selectedItem.id}>
              <TagItem
                {...getSelectedItemProps({ selectedItem, index })}
                text={selectedItem.name}
                isColored
                isClosable
                onClose={() => removeSelectedItem(selectedItem)}
              />
            </li>
          ))}
        </TagListWrapper>
      )}

      <div className="relative">
        <div className="relative w-full">
          <input
            placeholder="Search for a tag..."
            className="with-ring h-[50px] w-full rounded-button bg-gray-100 pl-5 pr-10 text-sm placeholder-gray-400"
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
          <button
            type="button"
            aria-label="toggle menu"
            {...getToggleButtonProps()}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </button>
          {errorText && <p className="absolute top-full right-1 mt-1 text-[10px] text-danger-400">{errorText}</p>}
        </div>

        <div {...getMenuProps()}>
          <Transition
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-button bg-gray-100 py-1 shadow-lg focus:outline-none">
              <>
                <li>
                  {!isTagExist && query !== '' && (
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="grid w-full grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm hover:bg-primary"
                    >
                      {addTag.isLoading ? <SpinnerIcon /> : <PlusIcon />}
                      <p className="text-left">
                        Create <span className="font-bold">{query}</span> tag
                      </p>
                    </button>
                  )}
                </li>
                {getFilteredTags?.map((filteredTag, index) => (
                  <TagsComboboxOption
                    key={filteredTag.id}
                    {...getItemProps({
                      item: filteredTag,
                      index,
                    })}
                    filteredTag={filteredTag}
                    active={highlightedIndex === index}
                  />
                ))}
              </>
            </ul>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default TagsCombobox;
