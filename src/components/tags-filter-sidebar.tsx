import { TrashIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useState, useRef } from 'react';

import { Document } from '@libs/types';

import { useQueryString } from '@hooks/useQueryString';

import { Category } from '@data-types/categorie.type';

import Button from './elements/button';
import Separator from './elements/separator';
import Tag from './elements/tag';
import TextInput from './elements/text-input';

interface TagsFilterSidebarProps {
  tags: Document<Category>[];
  className?: string;
}

const TagsFilterSidebar: React.FC<TagsFilterSidebarProps> = (props) => {
  const { removeTagQuery, addTagQuery, tagsQuery, clearTagQuery } = useQueryString();

  const [searchTag, setSearchTag] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <aside className={classNames('', props.className)}>
      {tagsQuery.length > 0 && (
        <>
          <h3 className="text-center mb-5 font-poppins-bold text-lg">
            Selected tags ({tagsQuery.length}) :
          </h3>
          <Button
            text="Clear tags"
            icon={<TrashIcon />}
            className="w-full mb-5 !bg-danger-400 !ring-danger-100"
            onClick={clearTagQuery}
          />
          <ul className="flex flex-wrap justify-end gap-[10px] gap-y-3">
            {tagsQuery?.map((tag) => (
              <li key={tag}>
                <Tag text={tag} isColored isClosable onClose={() => removeTagQuery(tag)} />
              </li>
            ))}
          </ul>
          <Separator className="my-8" />
        </>
      )}
      <h3 className="text-center mb-5 font-poppins-bold text-lg">Filter by tags (max 10) :</h3>
      <TextInput
        ref={searchRef}
        placeholder="Search for a tag..."
        type="search"
        id="search-tag"
        className="mb-5"
        inputClassName="font-poppins"
        onChange={(event) => setSearchTag(event.target.value)}
        value={searchTag}
        clearValue={() => {
          setSearchTag('');
          searchRef.current?.focus();
        }}
      />
      <ul className="flex flex-wrap justify-end gap-[10px] gap-y-3">
        {props.tags
          .filter(
            (tag) =>
              !tagsQuery.includes(tag.name) &&
              tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
              tag.count > 0
          )
          .map((tag) => (
            <li key={tag.id}>
              <Tag text={`${tag.name} (${tag.count})`} onClick={() => addTagQuery(tag.name)} />
            </li>
          ))}
      </ul>
    </aside>
  );
};

export default TagsFilterSidebar;
