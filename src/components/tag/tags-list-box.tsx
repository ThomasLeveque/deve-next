import { CheckIcon, PlusIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import Tag from '@components/elements/tag';
import TextInput from '@components/elements/text-input';

import { useAddCategory } from '@libs/category/queries';
import { db } from '@libs/firebase';
import { Document } from '@libs/types';

import { Category } from '@data-types/categorie.type';

import TagListWrapper from './tag-list-wrapper';

interface TagsListBoxOptionProps {
  index: number;
  tag: Document<Category>;
  isSelected: (tag: string) => boolean;
  addSelectedTags: (tag: string) => void;
  removeSelectedTags: (tag: string) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

interface TagsListBoxProps {
  tags?: Document<Category>[];
  setSelectedTags: (tags: string[]) => void;
  selectedTags: string[];
  className?: string;
  buttonClassName?: string;
  labelClassName?: string;
  label?: string;
  errorText?: string;
}

const TagsListBox: React.FC<TagsListBoxProps> = (props) => {
  const selectedTags = props.selectedTags ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [searchTag, setSearchTag] = useState<string>('');
  const [focusedTagIndex, setFocusedTagIndex] = useState<number>(0);

  const focusableWrapperRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const addCategory = useAddCategory();

  const isSelected = useCallback(
    (tag: string) =>
      !!selectedTags.find(
        (selectedTag) => selectedTag.toLocaleLowerCase() === tag.toLocaleLowerCase()
      ),
    [selectedTags]
  );

  const isTagExist = useMemo(
    () =>
      !!props.tags?.find((tag) => tag.name.toLocaleLowerCase() === searchTag.toLocaleLowerCase()),
    [props.tags, searchTag]
  );

  const addSelectedTags = useCallback(
    (tag: string) => {
      props.setSelectedTags([...selectedTags, tag]);
      // if (selectedTags.length < 4) {
      // }
    },
    [selectedTags]
  );
  const removeSelectedTags = useCallback(
    (tag: string) =>
      props.setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag)),
    [selectedTags]
  );

  const filteredTags = useMemo(
    () =>
      props.tags?.filter((tag) =>
        tag.name.toLocaleLowerCase().includes(searchTag.toLocaleLowerCase())
      ) ?? [],
    [searchTag, props.tags]
  );

  const handleOutsideClick = (event: MouseEvent) => {
    if (focusableWrapperRef.current?.contains(event.target as Node | null)) {
      // inside click
      return;
    }
    setFocusedTagIndex(0);
    setIsOpen(false);
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isOpen) {
        switch (event.key) {
          case 'ArrowDown':
            setFocusedTagIndex((prevIndex) =>
              prevIndex === filteredTags.length - 1 ? 0 : prevIndex + 1
            );
            break;
          case 'ArrowUp':
            setFocusedTagIndex((prevIndex) =>
              prevIndex === 0 ? filteredTags.length - 1 : prevIndex - 1
            );
            break;
          case 'Enter': {
            if (filteredTags[focusedTagIndex]) {
              const tag = filteredTags[focusedTagIndex].name;
              isSelected(tag) ? removeSelectedTags(tag) : addSelectedTags(tag);
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

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
            'font-poppins-bold text-[10px] uppercase text-black mb-[6px] ml-1 block',
            props.labelClassName
          )}
        >
          {props.label}
        </label>
      ) : null}
      {selectedTags.length > 0 && (
        <TagListWrapper className="mb-4">
          {selectedTags.map((selectedTag) => (
            <Tag
              text={selectedTag}
              key={selectedTag}
              isColored
              isClosable
              onClose={() => removeSelectedTags(selectedTag)}
            />
          ))}
        </TagListWrapper>
      )}
      <div className="relative" ref={focusableWrapperRef}>
        <TextInput
          ref={searchRef}
          placeholder="Search for tags..."
          id="search-new-tags"
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
        {isOpen && (
          <ul
            ref={tagListRef}
            className="absolute top-full w-full mt-2 rounded-button py-1 focus:outline-none shadow-lg max-h-60 overflow-auto bg-gray-100"
          >
            {!isTagExist && searchTag.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  addCategory.mutate({
                    categoryRef: db.collection('categories').doc(),
                    category: { name: searchTag, count: 0 },
                  });
                }}
                className="grid grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm w-full hover:bg-primary"
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
                  addSelectedTags(tag);
                  setSearchTag('');
                  searchRef.current?.focus();
                }}
                removeSelectedTags={removeSelectedTags}
                setCurrentIndex={setFocusedTagIndex}
                currentIndex={focusedTagIndex}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const TagsListBoxOption: React.FC<TagsListBoxOptionProps> = (props) => {
  const isSelected = props.isSelected(props.tag.name);
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          isSelected
            ? props.removeSelectedTags(props.tag.name)
            : props.addSelectedTags(props.tag.name);
          props.setCurrentIndex(props.index);
        }}
        className={classNames(
          'grid grid-cols-[20px,1fr] gap-3 px-4 py-2 text-sm w-full hover:bg-primary',
          {
            'bg-primary': props.index === props.currentIndex,
          }
        )}
      >
        <span>{isSelected && <CheckIcon />}</span>
        <p className="text-left">
          {props.tag.name} ({props.tag.count})
        </p>
      </button>
    </li>
  );
};

export default TagsListBox;
