import { AnnotationIcon, FireIcon, PencilAltIcon } from '@heroicons/react/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/solid';
import { ModalsStore, useModalsStore } from '@store/modals.store';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { QueryKey } from 'react-query';

import TagListWrapper from '@components/tag/tag-list-wrapper';

import { useAuth } from '@hooks/auth/useAuth';
import { useUpdateLink } from '@hooks/link/use-update-link';
import { useQueryString } from '@hooks/use-query-string';

import { Link } from '@data-types/link.type';

import { getDomain } from '@utils/format-string';
import { Document } from '@utils/shared-types';

import Tag from '../elements/tag';

const setLinkToCommentModalSelector = (state: ModalsStore) => state.setLinkToCommentModal;
const setLinkToUpdateModalSelector = (state: ModalsStore) => state.setLinkToUpdateModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

interface LinkItemProps {
  link: Document<Link>;
  isProfilLink?: boolean;
  linksQueryKey: QueryKey;
}

const LinkItem: React.FC<LinkItemProps> = React.memo(({ link, ...props }) => {
  const isProfilLink = props.isProfilLink ?? false;

  const { user } = useAuth();
  const { addTagQuery } = useQueryString();
  const updateLink = useUpdateLink(link, props.linksQueryKey);

  const setLinkToCommentModal = useModalsStore(setLinkToCommentModalSelector);
  const setLinkToUpdateModal = useModalsStore(setLinkToUpdateModalSelector);
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  const isLikedByMe = useMemo(
    () => !!link.votes.find((vote) => vote.voteBy.id === user?.id),
    [user, link]
  );

  const canUpdateLink = useMemo(() => user?.isAdmin || link.postedBy.id === user?.id, [user, link]);

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

  const addVote = useCallback(() => {
    const incrementedVoteLink: Partial<Document<Link>> = {
      voteCount: link.voteCount + 1,
      votes: [
        ...link.votes,
        { voteBy: { id: user?.id ?? '', displayName: user?.displayName ?? '' } },
      ],
    };
    updateLink.mutate(incrementedVoteLink);
  }, [link, user]);

  const removeVote = useCallback(() => {
    const decrementedVoteLink: Partial<Document<Link>> = {
      voteCount: link.voteCount - 1,
      votes: link.votes.filter((vote) => vote.voteBy.id !== user?.id),
    };
    updateLink.mutate(decrementedVoteLink);
  }, [link, user]);

  return (
    <li className="flex flex-col p-[30px] rounded-link-card bg-gray-100 group">
      <div className="mb-5 flex justify-between items-start space-x-3">
        <div>
          {!isProfilLink && (
            <h3 className="font-poppins-bold text-[13px] mb-1">
              Posted by {link.postedBy.displayName}
            </h3>
          )}
          <p className="text-[10px] text-gray-400">{format(link.createdAt, 'MMMM d yyyy')}</p>
        </div>
        {canUpdateLink && (
          <button
            className="hover:text-secondary group-hover:block hidden"
            onClick={() => (user ? setLinkToUpdateModal(link) : toggleAuthModal())}
          >
            <PencilAltIcon className="w-5" />
          </button>
        )}
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
            <Tag text={tag} isColored onClick={isProfilLink ? undefined : () => addTagQuery(tag)} />
          </li>
        ))}
      </TagListWrapper>
      <div className="flex mt-auto">
        <button
          onClick={() => {
            if (user) {
              isLikedByMe ? removeVote() : addVote();
            } else {
              toggleAuthModal();
            }
          }}
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
  );
});

export default LinkItem;
