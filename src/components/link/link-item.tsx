import { AnnotationIcon, FireIcon } from '@heroicons/react/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/solid';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useMemo } from 'react';

import TagListWrapper from '@components/tag/tag-list-wrapper';

import { useUpdateLink } from '@libs/link/queries';
import { Document } from '@libs/types';

import { useAuth } from '@hooks/useAuth';
import { useQueryString } from '@hooks/useQueryString';

import { Link } from '@data-types/link.type';

import { getDomain } from '@utils/format-string';

import Tag from '../elements/tag';

interface LinkItemProps {
  link: Document<Link>;
}

const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
  const { user } = useAuth();
  const { addTagQuery, tagsQuery, orderbyQuery } = useQueryString();
  const updateLink = useUpdateLink(link, orderbyQuery, tagsQuery);

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

  const addVote = () => {
    const incrementedVoteLink: Partial<Document<Link>> = {
      voteCount: link.voteCount + 1,
      votes: [
        ...link.votes,
        { voteBy: { id: user?.id ?? '', displayName: user?.displayName ?? '' } },
      ],
    };
    updateLink.mutate(incrementedVoteLink);
  };

  const removeVote = () => {
    const decrementedVoteLink: Partial<Document<Link>> = {
      voteCount: link.voteCount - 1,
      votes: link.votes.filter((vote) => vote.voteBy.id !== user?.id),
    };
    updateLink.mutate(decrementedVoteLink);
  };

  return (
    <li className="flex flex-col p-[30px] rounded-link-card bg-gray-100">
      <div className="mb-5">
        <h3 className="font-poppins-bold text-[13px] mb-1">
          Posted by {link.postedBy.displayName}
        </h3>
        <p className="text-[10px]">{format(link.createdAt, 'MMMM d yyyy')}</p>
      </div>
      <a href={link.url} rel="noreferrer" target="_blank" className="mb-8 with-ring block group">
        <h2 className="text-3xl mb-2 font-poppins-bold group-hover:text-secondary">
          {link.description}
        </h2>
        <p className="text-xs group-hover:underline">On {getDomain(link.url)}</p>
      </a>
      <TagListWrapper className="mb-5">
        {link.categories.map((tag) => (
          <li key={`${link.id}-${tag}`}>
            <Tag text={tag} isColored onClick={() => addTagQuery(tag)} />
          </li>
        ))}
      </TagListWrapper>
      <div className="flex mt-auto">
        <button
          onClick={isLikedByMe ? removeVote : addVote}
          className={classNames('flex items-center mr-5', { 'text-secondary': isLikedByMe })}
        >
          {isLikedByMe ? (
            <FireIconSolid className="mr-[6px] w-6" />
          ) : (
            <FireIcon className="mr-[6px] w-6" />
          )}
          <span className="font-poppins-bold text-[11px]">{renderFires}</span>
        </button>
        <div className="flex items-center">
          <AnnotationIcon className="mr-[6px] w-6" />
          <span className="font-poppins-bold text-[11px]">{renderComments}</span>
        </div>
      </div>
    </li>
  );
};

export default LinkItem;
