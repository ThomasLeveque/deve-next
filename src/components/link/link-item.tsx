import { AnnotationIcon, FireIcon } from '@heroicons/react/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/solid';
import { ModalsStore, useModalsStore } from '@store/modals.store';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useMemo } from 'react';

import TagListWrapper from '@components/tag/tag-list-wrapper';

import { useAuth } from '@hooks/auth/useAuth';
import { useUpdateLink } from '@hooks/link/use-update-link';
import { useQueryString } from '@hooks/useQueryString';

import { Link } from '@data-types/link.type';

import { getDomain } from '@utils/format-string';
import { Document } from '@utils/shared-types';

import Tag from '../elements/tag';

const setLinkToCommentModalSelector = (state: ModalsStore) => state.setLinkToCommentModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

interface LinkItemProps {
  link: Document<Link>;
}

const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
  const { user } = useAuth();
  const { addTagQuery, tagsQuery, orderbyQuery } = useQueryString();
  const updateLink = useUpdateLink(link, orderbyQuery, tagsQuery);

  const setLinkToCommentModal = useModalsStore(setLinkToCommentModalSelector);
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

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
    <>
      <li className="flex flex-col p-[30px] rounded-link-card bg-gray-100">
        <div className="mb-5">
          <h3 className="font-poppins-bold text-[13px] mb-1">
            Posted by {link.postedBy.displayName}
          </h3>
          <p className="text-[10px] text-gray-400">{format(link.createdAt, 'MMMM d yyyy')}</p>
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
            className={classNames('flex items-center mr-5 hover:text-secondary', {
              'text-secondary': isLikedByMe,
            })}
          >
            {isLikedByMe ? (
              <FireIconSolid className="mr-[6px] w-6" />
            ) : (
              <FireIcon className="mr-[6px] w-6" />
            )}
            <span className="font-poppins-bold text-[11px]">{renderFires}</span>
          </button>
          <button
            onClick={() => (user ? setLinkToCommentModal(link) : toggleAuthModal())}
            className="flex items-center hover:text-secondary"
          >
            <AnnotationIcon className="mr-[6px] w-6" />
            <span className="font-poppins-bold text-[11px]">{renderComments}</span>
          </button>
        </div>
      </li>
    </>
  );
};

export default LinkItem;
