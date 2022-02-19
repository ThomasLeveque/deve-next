import { AnnotationIcon, FireIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/solid';
import {
  useAuthModalOpen,
  useLinkToCommentModal,
  useLinkToRemoveModal,
  useLinkToUpdateModal,
} from '@store/modals.store';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { QueryKey } from 'react-query';

import TagListWrapper from '@components/tag/tag-list-wrapper';

import { useAuth } from '@api/auth/useAuth';

import { useUpdateLink } from '@hooks/link/use-update-link';
import { useQueryString } from '@hooks/use-query-string';

import { Link } from '@data-types/link.type';

import { getDomain } from '@utils/format-string';
import { Document } from '@utils/shared-types';

import Tag from '../elements/tag';

interface LinkItemProps {
  link: Document<Link>;
  // To know if the component is used inside the profil page
  isProfilLink?: boolean;
  linksQueryKey: QueryKey;
}

const LinkItem: React.FC<LinkItemProps> = React.memo(({ link, ...props }) => {
  const isProfilLink = props.isProfilLink ?? false;

  const { user } = useAuth();
  const { addTagQuery } = useQueryString();
  const updateLink = useUpdateLink(link, props.linksQueryKey);

  const setLinkToCommentModal = useLinkToCommentModal()[1];
  const setLinkToUpdateModal = useLinkToUpdateModal()[1];
  const setLinkToRemoveModal = useLinkToRemoveModal()[1];
  const setAuthModalOpen = useAuthModalOpen()[1];

  const isLikedByMe = useMemo(
    () => !!link.votes.find((vote) => vote.voteBy.id === user?.id),
    [user, link]
  );

  const canUpdateLinkData = useMemo(
    () => user && (user.isAdmin || link.postedBy.id === user.id),
    [user, link]
  );
  const canRemoveLink = useMemo(
    () => user && (user.isAdmin || link.postedBy.id === user.id),
    [user, link]
  );

  const renderFires = useMemo(() => {
    if (link.voteCount === 0) {
      return 'Hot stuff';
    } else {
      return `${link.voteCount}`;
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
      <div className="mb-5 flex justify-between items-start space-x-3 min-h-[20px]">
        <div>
          {!isProfilLink && (
            <h3 className="font-poppins-bold text-[13px] mb-1">{link.postedBy.displayName}</h3>
          )}
          <p className="text-[10px] text-gray-400">{format(link.createdAt, 'MMMM d yyyy')}</p>
        </div>
        <div className="space-x-1 group-hover:flex flex lg:hidden">
          {canUpdateLinkData && (
            <button
              className="hover:text-secondary"
              onClick={() =>
                canUpdateLinkData ? setLinkToUpdateModal(link) : setAuthModalOpen(true)
              }
            >
              <PencilAltIcon className="w-5" />
            </button>
          )}
          {canRemoveLink && (
            <button
              className="hover:text-secondary"
              onClick={() => (canRemoveLink ? setLinkToRemoveModal(link) : setAuthModalOpen(true))}
            >
              <TrashIcon className="w-5" />
            </button>
          )}
        </div>
      </div>
      <a
        href={link.url}
        rel="noreferrer"
        target="_blank"
        className="mb-8 with-ring link-item-link block"
      >
        <h2
          className={classNames('text-3xl mb-2 font-poppins-bold break-words', {
            '!text-2xl': link.description.length > 60,
          })}
        >
          {link.description}
        </h2>
        <p className="text-xs">On {getDomain(link.url)}</p>
      </a>
      <TagListWrapper className="mb-5">
        {link.categories.map((tag) => (
          <li key={`${link.id}-${tag}`}>
            <Tag
              text={tag}
              isColored
              disabled={isProfilLink}
              onClick={isProfilLink ? undefined : () => addTagQuery(tag)}
            />
          </li>
        ))}
      </TagListWrapper>
      <div className="flex mt-auto space-x-5">
        <button
          onClick={() => {
            if (user) {
              isLikedByMe ? removeVote() : addVote();
            } else {
              setAuthModalOpen(true);
            }
          }}
          className={classNames('flex items-center space-x-[6px] hover:text-secondary with-ring', {
            'text-secondary': isLikedByMe,
          })}
        >
          {isLikedByMe ? <FireIconSolid className="w-6" /> : <FireIcon className="w-6" />}
          <span className="font-poppins-bold text-[11px]">{renderFires}</span>
        </button>
        <button
          onClick={() => (user ? setLinkToCommentModal(link) : setAuthModalOpen(true))}
          className="flex items-center space-x-[6px] hover:text-secondary with-ring"
        >
          <AnnotationIcon className="w-6" />
          <span className="font-poppins-bold text-[11px]">{renderComments}</span>
        </button>
      </div>
    </li>
  );
});

export default LinkItem;
