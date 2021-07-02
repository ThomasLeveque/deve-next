import { AnnotationIcon, FireIcon } from '@heroicons/react/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/solid';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useMemo } from 'react';

import { Document } from '@libs/types';

import { useAuth } from '@hooks/useAuth';
import { useQueryString } from '@hooks/useQueryString';

import { Link } from '@data-types/link.type';

import { getDomain } from '@utils/format-string';

import Tag from './elements/tag';

interface LinkItemProps {
  link: Document<Link>;
}

const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
  const { user } = useAuth();
  const { addTagQuery } = useQueryString();

  const isLikedByMe = useMemo(
    () => !!link.votes.find((vote) => vote.voteBy.id === user?.id),
    [user, link]
  );

  const renderFires = useMemo(() => {
    if (link.voteCount === 0) {
      return 'This is fire !';
    } else if (link.voteCount === 1) {
      return `${link.voteCount} fire`;
    } else {
      return `${link.voteCount} fires`;
    }
  }, [link.voteCount]);

  const renderComments = useMemo(() => {
    if (link.commentCount === 0) {
      return 'Add comment';
    } else if (link.commentCount === 1) {
      return `${link.commentCount} comment`;
    } else {
      return `${link.commentCount} comments`;
    }
  }, [link.commentCount]);

  return (
    <li className="p-[30px] rounded-link-card bg-gray-100">
      <div className="mb-5">
        <h3 className="font-poppins-bold text-[13px] mb-1">
          Posted by {link.postedBy.displayName}
        </h3>
        <p className="text-[10px]">{format(link.createdAt, 'MMMM d yyyy')}</p>
      </div>
      <a href={link.url} rel="noreferrer" target="_blank" className="mb-5 with-ring block group">
        <h2 className="text-3xl mb-2 font-poppins-bold group-hover:text-secondary">
          {link.description}
        </h2>
        <p className="text-xs group-hover:underline">On {getDomain(link.url)}</p>
      </a>
      <ul className="mb-5 flex flex-wrap gap-[10px] gap-y-3">
        {link.categories.map((tag) => (
          <li key={`${link.id}-${tag}`}>
            <Tag text={tag} isColored onClick={() => addTagQuery(tag)} />
          </li>
        ))}
      </ul>
      <div className="flex">
        <div className={classNames('flex items-center mr-5', { 'text-secondary': isLikedByMe })}>
          {isLikedByMe ? (
            <FireIconSolid className="mr-[6px] w-6" />
          ) : (
            <FireIcon className="mr-[6px] w-6" />
          )}
          <span className="font-poppins-bold text-[11px]">{renderFires}</span>
        </div>
        <div className="flex items-center">
          <AnnotationIcon className="mr-[6px] w-6" />
          <span className="font-poppins-bold text-[11px]">{renderComments}</span>
        </div>
      </div>
    </li>
  );
};

export default LinkItem;
