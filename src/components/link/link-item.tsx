import { useAuth } from '@api/auth/useAuth';
import { useUpdateLink } from '@api/link/use-update-link';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { Link } from '@data-types/link.type';
import { AnnotationIcon, FireIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/solid';
import { useQueryString } from '@hooks/use-query-string';
import {
  useAuthModalOpen,
  useLinkToCommentModal,
  useLinkToRemoveModal,
  useLinkToUpdateModal,
} from '@store/modals.store';
import { getDomain } from '@utils/format-string';
import { Document } from '@utils/shared-types';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { QueryKey } from 'react-query';
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

  const isLikedByMe = useMemo(() => !!link.votes.find((vote) => vote.voteBy.id === user?.id), [user, link]);

  const canUpdateLinkData = useMemo(() => user && (user.isAdmin || link.postedBy.id === user.id), [user, link]);
  const canRemoveLink = useMemo(() => user && (user.isAdmin || link.postedBy.id === user.id), [user, link]);

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
      votes: [...link.votes, { voteBy: { id: user?.id ?? '', displayName: user?.displayName ?? '' } }],
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
    <li className="group flex flex-col rounded-link-card bg-gray-100 p-[30px]">
      <div className="mb-5 flex min-h-[20px] items-start justify-between space-x-3">
        <div>
          {!isProfilLink && <h3 className="mb-1 font-poppins-bold text-[13px]">{link.postedBy.displayName}</h3>}
          <p className="text-[10px] text-gray-400">{format(link.createdAt, 'MMMM d yyyy')}</p>
        </div>
        <div className="flex space-x-1 group-hover:flex lg:hidden">
          {canUpdateLinkData && (
            <button
              className="hover:text-secondary"
              onClick={() => (canUpdateLinkData ? setLinkToUpdateModal(link) : setAuthModalOpen(true))}
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
      <a href={link.url} rel="noreferrer" target="_blank" className="with-ring link-item-link mb-8 block">
        <h2
          className={classNames('mb-2 break-words font-poppins-bold text-3xl', {
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
      <div className="mt-auto flex space-x-5">
        <button
          onClick={() => {
            if (user) {
              isLikedByMe ? removeVote() : addVote();
            } else {
              setAuthModalOpen(true);
            }
          }}
          className={classNames('with-ring flex items-center space-x-[6px] hover:text-secondary', {
            'text-secondary': isLikedByMe,
          })}
        >
          {isLikedByMe ? <FireIconSolid className="w-6" /> : <FireIcon className="w-6" />}
          <span className="font-poppins-bold text-[11px]">{renderFires}</span>
        </button>
        <button
          onClick={() => (user ? setLinkToCommentModal(link) : setAuthModalOpen(true))}
          className="with-ring flex items-center space-x-[6px] hover:text-secondary"
        >
          <AnnotationIcon className="w-6" />
          <span className="font-poppins-bold text-[11px]">{renderComments}</span>
        </button>
      </div>
    </li>
  );
});

export default LinkItem;
