import classNames from 'classnames';
import React, { useState, useRef } from 'react';

import { useQueryString } from '@hooks/use-query-string';

import { Category } from '@data-types/categorie.type';

import { Document } from '@utils/shared-types';

import Separator from '../elements/separator';
import Tag from '../elements/tag';
import TextInput from '../elements/text-input';
import TagListWrapper from './tag-list-wrapper';

interface TagsFilterSidebarProps {
  tags: Document<Category>[];
  className?: string;
}

const TagsFilterSidebar: React.FC<TagsFilterSidebarProps> = (props) => {
  const { removeTagQuery, addTagQuery, tagsQuery } = useQueryString();

  const [searchTag, setSearchTag] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <aside className={classNames('', props.className)}>
      {tagsQuery.length > 0 && (
        <>
          <h3 className="text-center mb-5 font-poppins-bold text-lg">
            Selected tags ({tagsQuery.length}) :
          </h3>
          <TagListWrapper className="justify-end">
            {tagsQuery?.map((tag) => (
              <li key={tag}>
                <Tag text={tag} isColored isClosable onClose={() => removeTagQuery(tag)} />
              </li>
            ))}
          </TagListWrapper>
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
        onChange={(event) => setSearchTag(event.target.value)}
        value={searchTag}
        clearValue={() => {
          setSearchTag('');
          searchRef.current?.focus();
        }}
      />
      <TagListWrapper className="justify-end">
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
      </TagListWrapper>
    </aside>
  );
};

export default React.memo(TagsFilterSidebar);
