'use client';

import AddCommentModal from '@/components/modals/AddCommentModal';
import LoginModal from '@/components/modals/LoginModal';
import RemoveLinkModal from '@/components/modals/RemoveLinkModal';
import UpdateLinkModal from '@/components/modals/UpdateLinkModal';
import { TagListWrapper } from '@/components/TagListWrapper';
import { Badge } from '@/components/ui/badge';
import { DialogTrigger } from '@/components/ui/dialog';
import { GetLinksReturn } from '@/data/link/get-links';
import { TagRow } from '@/data/tag/use-tags';
import { useAddLinkVote } from '@/data/vote/use-add-vote';
import { useRemoveLinkVote } from '@/data/vote/use-remove-vote';
import { arrayToSingle, cn, singleToArray } from '@/lib/utils';
import { useProfile } from '@/store/profile.store';
import { getDomain } from '@/utils/format-string';
import { format } from 'date-fns';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

interface LinkItemProps {
  link: GetLinksReturn['data'][0];
  // To know if the component is used inside the profil page
  isProfilLink?: boolean;
}

function LinkCard({ link, isProfilLink = false }: LinkItemProps) {
  const router = useRouter();
  const profile = useProfile()[0];

  const profileVote = useMemo(
    () => singleToArray(link.votes).find((vote) => vote.userId === profile?.id),
    [profile, link.votes]
  );

  const canUpdateLinkData = profile && (profile.role === 'admin' || link.userId === profile.id);
  const canRemoveLink = profile && (profile.role === 'admin' || link.userId === profile.id);

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
    <li className="rounded-link-card group flex flex-col bg-gray-100 p-[30px]">
      <div className="mb-5 flex min-h-[20px] items-start justify-between space-x-3">
        <div>
          {!isProfilLink && <h3 className="mb-1 text-[13px] font-bold">{arrayToSingle(link.user)?.username}</h3>}
          <p className="text-[10px] text-gray-400">{format(new Date(link.createdAt), 'MMMM d yyyy')}</p>
        </div>
        <div className="flex space-x-1.5 group-hover:flex lg:hidden">
          {canUpdateLinkData && <UpdateLinkModal linkToUpdate={link} />}
          {canRemoveLink && <RemoveLinkModal linkIdToRemove={link.id} />}
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
            <button onClick={() => goToTagPage(tag)}>
              <Badge variant="default">{tag.name}</Badge>
            </button>
          </li>
        ))}
      </TagListWrapper>
      <div className="mt-auto flex space-x-5">
        <LoginModal>
          <DialogTrigger
            className={cn('with-ring flex items-center space-x-[6px]')}
            onClick={(event) => {
              if (profile) {
                event.preventDefault();
                profileVote
                  ? removeVote.mutate(profileVote.id)
                  : addVote.mutate({
                      userId: profile.id,
                      linkId: link.id,
                    });
              }
            }}
          >
            {Boolean(profileVote) ? <ThumbsDown size={16} /> : <ThumbsUp size={16} />}
            <span className="text-[11px] font-bold">{renderFires}</span>
          </DialogTrigger>
        </LoginModal>
        {profile ? (
          <AddCommentModal linkToComment={link}>
            <AddCommentModal.Trigger>{renderComments}</AddCommentModal.Trigger>
          </AddCommentModal>
        ) : (
          <LoginModal>
            <AddCommentModal.Trigger>{renderComments}</AddCommentModal.Trigger>
          </LoginModal>
        )}
      </div>
    </li>
  );
}

export default LinkCard;
