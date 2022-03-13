import { useAddTag } from '@api/tag/use-add-tag';
import { useRemoveTag } from '@api/tag/use-remove-tag';
import Tag from '@components/elements/tag';
import TextInput from '@components/elements/text-input';
import { Transition } from '@headlessui/react';
import { CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { Tag as TagModel } from '@models/tag';
import { useProfile } from '@store/profile.store';
import { formatError } from '@utils/format-string';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import TagListWrapper from './tag-list-wrapper';

interface TagsListBoxProps {
  tags?: TagModel[];
  setSelectedTags: (tags: number[]) => void;
  selectedTags: number[];
  className?: string;
  buttonClassName?: string;
  labelClassName?: string;
  label?: string;
  errorText?: string;
}

const TagsListBox: React.FC<TagsListBoxProps> = React.memo((props) => {
  const selectedTags = props.selectedTags ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [searchTag, setSearchTag] = useState<string>('');
  const [focusedTagIndex, setFocusedTagIndex] = useState<number>(0);

  const focusableWrapperRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const addTag = useAddTag();

  const isSelected = useCallback(
    (tagId: number) => !!selectedTags.find((selectedTagId) => selectedTagId === tagId),
    [selectedTags]
  );

  const isTagExist = useMemo(
    () => !!props.tags?.find((tag) => tag.name.toLocaleLowerCase() === searchTag.toLocaleLowerCase()),
    [props.tags, searchTag]
  );

  const addSelectedTags = useCallback(
    (tagId: number) => {
      if (selectedTags.length < 4) {
        props.setSelectedTags([...selectedTags, tagId]);
      }
    },
    [selectedTags]
  );
  const removeSelectedTags = useCallback(
    (tagId: number) => {
      props.setSelectedTags(selectedTags.filter((selectedTagId) => selectedTagId !== tagId));
    },
    [selectedTags]
  );

  const filteredTags = useMemo(
    () => props.tags?.filter((tag) => tag.name.toLocaleLowerCase().includes(searchTag.toLocaleLowerCase())) ?? [],
    [searchTag, props.tags]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isOpen) {
        switch (event.key) {
          case 'ArrowDown':
            setFocusedTagIndex((prevIndex) => (prevIndex === filteredTags.length - 1 ? 0 : prevIndex + 1));
            break;
          case 'ArrowUp':
            setFocusedTagIndex((prevIndex) => (prevIndex === 0 ? filteredTags.length - 1 : prevIndex - 1));
            break;
          case 'Enter': {
            if (filteredTags[focusedTagIndex]) {
              const tagId = filteredTags[focusedTagIndex].id;
              isSelected(tagId) ? removeSelectedTags(tagId) : addSelectedTags(tagId);
              setSearchTag('');
              searchRef.current?.focus();
              break;
            }
          }
        }
      }
    },
    [filteredTags, isOpen, focusedTagIndex, isSelected]
  );

  const handleAddTag = useCallback(async () => {
    try {
      const tagName = searchTag.trim();
      const newTag = await addTag.mutateAsync({
        name: tagName,
      });
      addSelectedTags(newTag.id);
      setSearchTag('');
      searchRef.current?.focus();
    } catch (err) {
      toast.error(formatError(err as Error));
    }
  }, [searchTag]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [filteredTags, isOpen, focusedTagIndex, isSelected]);

  return (
    <div className={classNames(props.className)}>
      {props.label !== undefined ? (
        <label
          className={classNames(
            'mb-[6px] ml-1 block font-poppins-bold text-[10px] uppercase text-black',
            props.labelClassName
          )}
        >
          {props.label}
        </label>
      ) : null}
      {selectedTags.length > 0 && (
        <TagListWrapper className="mb-4">
          {selectedTags.map((selectedTagId) => (
            <Tag
              text={props.tags?.find((tag) => tag.id === selectedTagId)?.name ?? ''}
              key={`${selectedTagId}`}
              isColored
              isClosable
              onClose={() => {
                removeSelectedTags(selectedTagId);
              }}
            />
          ))}
        </TagListWrapper>
      )}
      <div className="relative" ref={focusableWrapperRef}>
        <TextInput
          ref={searchRef}
          placeholder="Search for tags..."
          id="search-new-tags"
          wrapperClassName="z-30"
          type="search"
          autoComplete="off"
          onChange={(event) => {
            setSearchTag(event.target.value);
            setFocusedTagIndex(0);
          }}
          value={searchTag}
          clearValue={() => {
            setSearchTag('');
            searchRef.current?.focus();
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
            }
          }}
          errorText={props.errorText}
        />
        <Transition
          show={isOpen}
          enter="transition duration-100 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
        >
          <div
            className="fixed inset-0 z-10 h-full w-full"
            onClick={() => {
              setFocusedTagIndex(0);
              setIsOpen(false);
            }}
          />
          <ul
            ref={tagListRef}
            className="absolute top-full z-30 mt-2 max-h-60 w-full overflow-auto rounded-button bg-gray-100 py-1 shadow-lg focus:outline-none"
          >
            {/* Add tag button */}
            {!isTagExist && searchTag.length > 0 && (
              <button
                type="button"
                onClick={handleAddTag}
                className="grid w-full grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm hover:bg-primary"
              >
                <PlusIcon />
                <p className="text-left">
                  Create <span className="font-poppins-bold">{searchTag}</span> tag
                </p>
              </button>
            )}
            {filteredTags.map((tag, index) => (
              <TagsListBoxOption
                key={tag.id}
                index={index}
                tag={tag}
                isSelected={isSelected}
                addSelectedTags={(tag) => {
                  addSelectedTags(tag.id);
                  setSearchTag('');
                  searchRef.current?.focus();
                }}
                removeSelectedTags={removeSelectedTags}
                setCurrentIndex={setFocusedTagIndex}
                currentIndex={focusedTagIndex}
              />
            ))}
          </ul>
        </Transition>
      </div>
    </div>
  );
});

interface TagsListBoxOptionProps {
  index: number;
  tag: TagModel;
  isSelected: (tagId: number) => boolean;
  addSelectedTags: (tag: TagModel) => void;
  removeSelectedTags: (tagId: number) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const TagsListBoxOption: React.FC<TagsListBoxOptionProps> = (props) => {
  const [profile] = useProfile();
  const removeTag = useRemoveTag();

  const isSelected = props.isSelected(props.tag.id);
  const canBeRemove = props.tag.links?.length === 0 && profile?.role === 'admin';

  const handleRemoveTag = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (props.tag.id && canBeRemove) {
      props.removeSelectedTags(props.tag.id);
      removeTag.mutate(props.tag.id);
    }
  }, []);

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          isSelected ? props.removeSelectedTags(props.tag.id) : props.addSelectedTags(props.tag);
          props.setCurrentIndex(props.index);
        }}
        className={classNames(
          'grid w-full grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm hover:bg-primary',
          {
            'bg-primary': props.index === props.currentIndex,
          },
          { 'grid-cols-[20px,1fr,20px]': canBeRemove }
        )}
      >
        <span>{isSelected && <CheckIcon />}</span>
        <p className="text-left">
          {props.tag.name} ({props.tag.links?.length ?? 0})
        </p>
        {canBeRemove && (
          <button type="button" onClick={handleRemoveTag} className="rounded-[4px] hover:bg-black/10">
            <TrashIcon />
          </button>
        )}
      </button>
    </li>
  );
};

export default TagsListBox;
