import { useAddTag } from '@api/tag/use-add-tag';
import { useTags } from '@api/tag/use-tags';
import SpinnerIcon from '@components/icons/spinner-icon';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { Transition } from '@headlessui/react';
import { InformationCircleIcon, PlusIcon, SelectorIcon } from '@heroicons/react/outline';
import { Tag as TagModel } from '@models/tag';
import { formatError } from '@utils/format-string';
import { useCombobox, useMultipleSelection } from 'downshift';
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Tag from '../elements/tag';
import TagsComboboxOption from './tags-combobox-option';

const MAX_TAGS_LENGTH = 4;

interface TagsComboboxProps {
  selectedTags: TagModel[];
  setSelectedTags: (tags: TagModel[]) => void;
  className?: string;
  errorText?: string;
}

const TagsCombobox: React.FC<TagsComboboxProps> = ({ selectedTags = [], setSelectedTags, className, errorText }) => {
  const [query, setQuery] = useState('');
  const addTag = useAddTag();

  const { data: tags } = useTags({ refetchOnMount: false });

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

  const filteredTags =
    query === '' ? tags : tags?.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()));

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    inputValue: query,
    defaultHighlightedIndex: 0,
    selectedItem: null,
    items: filteredTags ?? [],
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
          if (isSelected(selectedItem.id)) {
            setQuery('');
            removeSelectedItem(selectedItem);
            break;
          }

          if (selectedItems.length >= MAX_TAGS_LENGTH) {
            toast('No more than 4 tags', {
              className: 'Info',
              icon: <InformationCircleIcon />,
            });
            break;
          }
          setQuery('');
          addSelectedItem(selectedItem);
          break;
        default:
          break;
      }
    },
  });

  const isSelected = useCallback(
    (itemId: number) => !!selectedItems.find((selectedItem) => selectedItem.id === itemId),
    [selectedItems]
  );

  const handleAddTag = useCallback(async () => {
    try {
      const tagName = query.trim();
      const newTag = await addTag.mutateAsync({
        name: tagName,
      });
      addSelectedItem(newTag);
      setQuery('');
    } catch (err) {
      toast.error(formatError(err as Error));
    }
  }, [query, selectedTags]);

  return (
    <div className={className}>
      <label {...getLabelProps()} className="mb-[6px] ml-1 block font-poppins-bold text-[10px] uppercase text-black">
        TAGS (MIN 1, MAX 4)
      </label>
      {selectedItems.length > 0 && (
        <TagListWrapper className="mb-4">
          {selectedItems.map((selectedItem, index) => (
            <li key={selectedItem.id} {...getSelectedItemProps({ selectedItem, index })}>
              <Tag text={selectedItem.name} isColored isClosable onClose={() => removeSelectedItem(selectedItem)} />
            </li>
          ))}
        </TagListWrapper>
      )}

      <div className="relative">
        <div {...getComboboxProps()} className="relative  w-full">
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
            <SelectorIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
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
                        Create <span className="font-poppins-bold">{query}</span> tag
                      </p>
                    </button>
                  )}
                </li>
                {filteredTags?.map((filteredTag, index) => (
                  <TagsComboboxOption
                    key={filteredTag.id}
                    {...getItemProps({
                      item: filteredTag,
                      index,
                      isSelected: isSelected(filteredTag.id),
                    })}
                    filteredTag={filteredTag}
                    active={highlightedIndex === index}
                    selected={isSelected(filteredTag.id)}
                    removeSelectedItem={removeSelectedItem}
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
