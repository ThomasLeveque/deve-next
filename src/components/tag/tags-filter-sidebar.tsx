import { useTags } from '@api/tag/use-tags';
import SpinnerIcon from '@components/icons/spinner-icon';
import { useQueryString } from '@hooks/use-query-string';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import Separator from '../elements/separator';
import Tag from '../elements/tag';
import TextInput from '../elements/text-input';
import TagListWrapper from './tag-list-wrapper';

interface TagsFilterSidebarProps {
  className?: string;
}

const TagsFilterSidebar: React.FC<TagsFilterSidebarProps> = React.memo((props) => {
  const { removeTagQuery, addTagQuery, tagsQuery } = useQueryString();
  const { data: tags } = useTags({ refetchOnMount: false });

  const [searchTag, setSearchTag] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  return !tags ? (
    <div className="w-sidebar">
      <SpinnerIcon className="m-auto mt-6 w-8" />
    </div>
  ) : (
    <div className={classNames('w-sidebar', props.className)}>
      {tagsQuery.length > 0 && (
        <>
          <h3 className="mb-5 text-center font-poppins-bold text-lg">Selected tags ({tagsQuery.length}) :</h3>
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
      <h3 className="mb-5 text-center font-poppins-bold text-lg">Filter by tags (max 10) :</h3>
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
        {tags
          .filter(
            (tag) =>
              !tagsQuery.includes(tag.name) &&
              tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
              (tag.links?.length ?? 0) > 0
          )
          .map((tag) => (
            <li key={tag.id}>
              <Tag text={`${tag.name} (${tag.links?.length ?? 0})`} onClick={() => addTagQuery(tag.name)} />
            </li>
          ))}
      </TagListWrapper>
    </div>
  );
});

export default TagsFilterSidebar;
