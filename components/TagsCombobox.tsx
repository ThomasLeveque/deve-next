import { TagListWrapper } from '@/components/TagListWrapper';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { Badge } from '@/components/ui/badge';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { useAddTag } from '@/data/tag/use-add-tag';
import { useTags } from '@/data/tag/use-tags';
import { formatError, stringToSlug } from '@/utils/format-string';
import { useCombobox, useMultipleSelection } from 'downshift';
import { ChevronDown, InfoIcon, PlusIcon, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import TagsComboboxOption from './TagsComboboxOption';

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
          icon: <InfoIcon />,
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
              <Badge {...getSelectedItemProps({ selectedItem, index })}>
                {selectedItem.name}
                <X className="ml-1 cursor-pointer" size={16} onClick={() => removeSelectedItem(selectedItem)} />
              </Badge>
            </li>
          ))}
        </TagListWrapper>
      )}

      <div className="relative">
        <div className="relative w-full">
          <input
            placeholder="Search for a tag..."
            className="with-ring rounded-button h-[50px] w-full bg-gray-100 pl-5 pr-10 text-sm placeholder-gray-400"
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
          <button
            type="button"
            aria-label="toggle menu"
            {...getToggleButtonProps()}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronDown className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </button>
          {errorText && <p className="text-danger-400 absolute right-1 top-full mt-1 text-[10px]">{errorText}</p>}
        </div>

        <div {...getMenuProps()}>
          <ul className="rounded-button absolute z-50 mt-2 max-h-60 w-full overflow-auto bg-gray-100 py-1 shadow-lg focus:outline-none">
            <>
              <li>
                {!isTagExist && query !== '' && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="grid w-full grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm hover:bg-primary"
                  >
                    {addTag.isPending ? <SpinnerIcon size={16} /> : <PlusIcon size={16} />}
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
        </div>
      </div>
    </div>
  );
};

export default TagsCombobox;
