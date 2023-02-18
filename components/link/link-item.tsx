'use client';

import { useSupabase } from '@components/SupabaseAuthProvider';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { GetLinksReturn } from '@data/link/get-links';
import { TagRow } from '@data/tag/use-tags';
import { useAddLinkVote } from '@data/vote/use-add-vote';
import { useRemoveLinkVote } from '@data/vote/use-remove-vote';
import { ChatBubbleBottomCenterTextIcon, FireIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/24/solid';
import { useCustomRouter } from '@hooks/useCustomRouter';
import {
  useAuthModalOpen,
  useLinkToCommentModal,
  useLinkToRemoveModal,
  useLinkToUpdateModal,
} from '@store/modals.store';
import { arrayToSingle } from '@utils/array-to-single';
import { cn } from '@utils/cn';
import { getDomain } from '@utils/format-string';
import { singleToArray } from '@utils/single-to-array';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import TagItem from '../tag/tag-item';

interface LinkItemProps {
  link: GetLinksReturn['data'][0];
  // To know if the component is used inside the profil page
  isProfilLink?: boolean;
}

const LinkItem: React.FC<LinkItemProps> = ({ link, isProfilLink = false }) => {
  const router = useCustomRouter();
  const { profile } = useSupabase();

  const setLinkToCommentModal = useLinkToCommentModal()[1];
  const setLinkToUpdateModal = useLinkToUpdateModal()[1];
  const setLinkToRemoveModal = useLinkToRemoveModal()[1];
  const setAuthModalOpen = useAuthModalOpen()[1];

  const profileVote = useMemo(
    () => singleToArray(link.votes).find((vote) => vote.userId === profile?.id),
    [profile, link.votes]
  );

  const canUpdateLinkData = useMemo(
    () => profile && (profile.role === 'admin' || link.userId === profile.id),
    [profile, link.userId]
  );
  const canRemoveLink = useMemo(
    () => profile && (profile.role === 'admin' || link.userId === profile.id),
    [profile, link.userId]
  );

  const renderFires = useMemo(() => {
    if (link.votesCount === 0) {
      return 'Hot stuff';
    } else {
      return `${link.votesCount}`;
    }
  }, [link.votesCount]);

  const renderComments = useMemo(() => {
    if (link.commentsCount === 0) {
      return 'Add comment';
    } else if (link.commentsCount === 1) {
      return `${link.commentsCount} comment`;
    } else {
      return `${link.commentsCount} comments`;
    }
  }, [link.commentsCount]);

  const addVote = useAddLinkVote(link);

  const removeVote = useRemoveLinkVote(link);

  function goToTagPage(tag: TagRow) {
    if (tag.slug) {
      router.push(`/tags/${tag.slug}`);
    } else {
      toast.error('Tag slug not defined');
    }
  }

  return (
    <li className="group flex flex-col rounded-link-card bg-gray-100 p-[30px]">
      <div className="mb-5 flex min-h-[20px] items-start justify-between space-x-3">
        <div>
          {!isProfilLink && <h3 className="mb-1 text-[13px] font-bold">{arrayToSingle(link.user)?.username}</h3>}
          <p className="text-[10px] text-gray-400">{format(new Date(link.createdAt), 'MMMM d yyyy')}</p>
        </div>
        <div className="flex space-x-1 group-hover:flex lg:hidden">
          {canUpdateLinkData && (
            <button
              className="hover:text-secondary"
              onClick={() => (canUpdateLinkData ? setLinkToUpdateModal(link) : setAuthModalOpen(true))}
            >
              <PencilSquareIcon className="w-5" />
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
          className={cn('mb-2 break-words text-3xl font-bold', {
            '!text-2xl': link.description.length > 60,
          })}
        >
          {link.description}
        </h2>
        <p className="text-xs">On {getDomain(link.url)}</p>
      </a>
      <TagListWrapper className="mb-5">
        {singleToArray(link.tags).map((tag) => (
          <li key={tag.id}>
            <TagItem text={tag.name} isColored onClick={() => goToTagPage(tag)} />
          </li>
        ))}
      </TagListWrapper>
      <div className="mt-auto flex space-x-5">
        <button
          onClick={() => {
            if (profile) {
              profileVote
                ? removeVote.mutate(profileVote.id)
                : addVote.mutate({
                    userId: profile.id,
                    linkId: link.id,
                  });
            } else {
              setAuthModalOpen(true);
            }
          }}
          className={cn('with-ring flex items-center space-x-[6px] hover:text-secondary', {
            'text-secondary': Boolean(profileVote),
          })}
        >
          {Boolean(profileVote) ? <FireIconSolid className="w-6" /> : <FireIcon className="w-6" />}
          <span className="text-[11px] font-bold">{renderFires}</span>
        </button>
        <button
          onClick={() => (profile ? setLinkToCommentModal(link) : setAuthModalOpen(true))}
          className="with-ring flex items-center space-x-[6px] hover:text-secondary"
        >
          <ChatBubbleBottomCenterTextIcon className="w-6" />
          <span className="text-[11px] font-bold">{renderComments}</span>
        </button>
      </div>
    </li>
  );
};

export default LinkItem;
