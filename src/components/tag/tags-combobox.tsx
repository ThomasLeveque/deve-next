import { useAddTag } from '@api/tag/use-add-tag';
import { useTags } from '@api/tag/use-tags';
import SpinnerIcon from '@components/icons/spinner-icon';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { Combobox, Transition } from '@headlessui/react';
import { InformationCircleIcon, PlusIcon, SelectorIcon } from '@heroicons/react/outline';
import { Tag as TagModel } from '@models/tag';
import { formatError } from '@utils/format-string';
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

// WORKs BUT SELECTED INSIDE OPTION DO NOT
const TagsCombobox: React.FC<TagsComboboxProps> = ({ selectedTags = [], setSelectedTags, className, errorText }) => {
  const [query, setQuery] = useState('');
  const addTag = useAddTag();

  const { data: tags } = useTags({ refetchOnMount: false });

  const filteredTags =
    query === '' ? tags : tags?.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()));

  const isTagExist = useMemo(
    () => !!tags?.find((tag) => tag.name.toLocaleLowerCase() === query.toLocaleLowerCase()),
    [tags, query]
  );

  const handleChange = useCallback(
    (tagsToSelect: TagModel[]) => {
      if (tagsToSelect.length <= MAX_TAGS_LENGTH) {
        setSelectedTags(tagsToSelect);
        setQuery('');
      } else {
        toast(`${MAX_TAGS_LENGTH} tags max`, {
          className: 'Info',
          icon: <InformationCircleIcon />,
        });
      }
    },
    [setSelectedTags]
  );

  const handleAddTag = useCallback(async () => {
    try {
      const tagName = query.trim();
      const newTag = await addTag.mutateAsync({
        name: tagName,
      });
      handleChange([...selectedTags, newTag]);
      setQuery('');
    } catch (err) {
      toast.error(formatError(err as Error));
    }
  }, [query, selectedTags]);

  const handleRemoveSelectedTags = useCallback(
    (tagId: number) => {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag.id !== tagId));
    },
    [selectedTags, setSelectedTags]
  );

  return (
    <Combobox as="div" value={selectedTags} onChange={handleChange} className={className} name="tags">
      <Combobox.Label className="mb-[6px] ml-1 block font-poppins-bold text-[10px] uppercase text-black">
        TAGS (MIN 1, MAX 4)
      </Combobox.Label>
      {selectedTags.length > 0 && (
        <TagListWrapper className="mb-4">
          {selectedTags.map((selectedTag) => (
            <Tag
              text={selectedTag.name}
              key={selectedTag.id}
              isColored
              isClosable
              onClose={() => handleRemoveSelectedTags(selectedTag.id)}
            />
          ))}
        </TagListWrapper>
      )}

      <div className="relative">
        <div className="relative z-50 w-full">
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </Combobox.Button>

          <Combobox.Input
            placeholder="Search for a tag..."
            className="with-ring h-[50px] w-full rounded-button bg-gray-100 pl-5 pr-10 text-sm placeholder-gray-400"
            onChange={(event) => setQuery(event.target.value)}
          />
          {errorText && <p className="absolute top-full right-1 mt-1 text-[10px] text-danger-400">{errorText}</p>}
        </div>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
        >
          <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-button bg-gray-100 py-1 shadow-lg focus:outline-none">
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
            {filteredTags?.map((filteredTag) => (
              <TagsComboboxOption
                key={filteredTag.id}
                filteredTag={filteredTag}
                selectedTags={selectedTags}
                handleRemoveSelectedTags={handleRemoveSelectedTags}
              />
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default TagsCombobox;
