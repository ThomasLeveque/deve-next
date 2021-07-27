import { CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import Tag from '@components/elements/tag';
import TextInput from '@components/elements/text-input';

import { useAuth } from '@hooks/auth/useAuth';
import { dbKeys } from '@hooks/category/db-keys';
import { useAddCategory } from '@hooks/category/use-add-category';
import { useRemoveCategory } from '@hooks/category/use-remove-category';

import { Category } from '@data-types/categorie.type';
import { User } from '@data-types/user.type';

import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import TagListWrapper from './tag-list-wrapper';

interface TagsListBoxOptionProps {
  index: number;
  tag: Document<Category>;
  isSelected: (tag: string) => boolean;
  addSelectedTags: (tag: string) => void;
  removeSelectedTags: (tag: string) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  user: Document<User> | null;
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

const TagsListBox: React.FC<TagsListBoxProps> = React.memo((props) => {
  const { user } = useAuth();
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
      if (selectedTags.length < 4) {
        props.setSelectedTags([...selectedTags, tag]);
      }
    },
    [selectedTags]
  );
  const removeSelectedTags = useCallback(
    (tag: string) => {
      props.setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    },
    [selectedTags]
  );

  const filteredTags = useMemo(
    () =>
      props.tags?.filter((tag) =>
        tag.name.toLocaleLowerCase().includes(searchTag.toLocaleLowerCase())
      ) ?? [],
    [searchTag, props.tags]
  );

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
          {selectedTags.map((selectedTag, i) => (
            <Tag
              text={selectedTag}
              key={`${selectedTag}${i}`}
              isColored
              isClosable
              onClose={() => {
                removeSelectedTags(selectedTag);
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
          className="z-30"
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
          <>
            <div
              className="fixed inset-0 w-full h-full z-10"
              onClick={() => {
                setFocusedTagIndex(0);
                setIsOpen(false);
              }}
            />
            <ul
              ref={tagListRef}
              className="absolute z-30 top-full w-full mt-2 rounded-button py-1 focus:outline-none shadow-lg max-h-60 overflow-auto bg-gray-100"
            >
              {/* Add tag button */}
              {!isTagExist && searchTag.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const tagName = searchTag.trim();
                    addCategory.mutate({
                      categoryRef: db.collection(dbKeys.categories).doc(),
                      category: { name: tagName, count: 0 },
                    });
                    addSelectedTags(tagName);
                    setSearchTag('');
                    searchRef.current?.focus();
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
                  user={user}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
});

const TagsListBoxOption: React.FC<TagsListBoxOptionProps> = (props) => {
  const removeCategory = useRemoveCategory();

  const isSelected = props.isSelected(props.tag.name);
  const canBeRemove = props.tag.count === 0 && props.user?.isAdmin;

  const handleRemoveTag = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (props.tag.id) {
      props.removeSelectedTags(props.tag.name);
      removeCategory.mutate(props.tag);
    }
  }, []);

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
          },
          { 'grid-cols-[20px,1fr,20px]': canBeRemove }
        )}
      >
        <span>{isSelected && <CheckIcon />}</span>
        <p className="text-left">
          {props.tag.name} ({props.tag.count})
        </p>
        {canBeRemove && (
          <button
            type="button"
            onClick={handleRemoveTag}
            className="hover:bg-black/10 rounded-[4px]"
          >
            <TrashIcon />
          </button>
        )}
      </button>
    </li>
  );
};

export default TagsListBox;
