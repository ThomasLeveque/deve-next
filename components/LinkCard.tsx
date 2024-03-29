'use client';

import { TagListWrapper } from '@/components/TagListWrapper';
import AddCommentModal from '@/components/modals/AddCommentModal';
import UpdateLinkModal from '@/components/modals/LinkModals/UpdateLinkModal';
import LoginModal from '@/components/modals/LoginModal';
import RemoveLinkModal from '@/components/modals/RemoveLinkModal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useLinkVote } from '@/data/vote/use-link-vote';
import { FetchLinksReturn } from '@/lib/queries/fetch-links';
import { FetchProfileReturn } from '@/lib/queries/fetch-profile';
import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { TagRow } from '@/lib/supabase/types';
import { cn } from '@/utils/cn';
import { getDomain } from '@/utils/format-string';
import { format } from 'date-fns';
import { ExternalLink, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface LinkItemProps {
  link: FetchLinksReturn['links'][0];
  // To know if the component is used inside the profil page
  isProfilLink?: boolean;
  profile: FetchProfileReturn;
  tags: FetchTagsReturn;
}

function LinkCard({ link, isProfilLink = false, profile, tags }: LinkItemProps) {
  const { destructiveToast } = useToast();
  const router = useRouter();

  const [votes, setVotes] = useState(link.votes);
  const [commentsCount, setCommentsCount] = useState(link.comments.length);

  const profileVote = useMemo(() => votes.find((vote) => vote.userId === profile?.id), [profile, votes]);

  const canUpdateLinkData = profile && (profile.role === 'admin' || link.userId === profile.id);
  const canRemoveLink = profile && (profile.role === 'admin' || link.userId === profile.id);

  const mutateLinkVote = useLinkVote({
    onSuccess(data, variables) {
      if (variables.type === 'add') {
        setVotes((prev) => [...prev, data]);
      } else {
        setVotes((prev) => prev.filter((vote) => vote.id !== variables.voteId));
      }
    },
  });

  const renderFires = useMemo(() => {
    if (votes.length === 0) {
      return 'Hot stuff';
    } else {
      return `${votes.length}`;
    }
  }, [votes.length]);

  const renderComments = useMemo(() => {
    if (commentsCount === 0) {
      return 'Add comment';
    } else if (commentsCount === 1) {
      return `${commentsCount} comment`;
    } else {
      return `${commentsCount} comments`;
    }
  }, [commentsCount]);

  function goToTagPage(tag: TagRow) {
    if (tag.slug) {
      router.push(`/tags/${tag.slug}`);
    } else {
      destructiveToast({
        description: 'Tag slug not defined',
      });
    }
  }

  return (
    <li className="group h-full">
      <Card className="flex h-full flex-col">
        <CardHeader className="space-y-5">
          <div className="flex min-h-[20px] items-start justify-between space-x-3">
            <div>
              {!isProfilLink && link.user && <h3 className="mb-1 text-[13px] font-bold">{link.user.username}</h3>}
              <p className="text-[10px] text-gray-400">{format(new Date(link.createdAt), 'MMMM d yyyy')}</p>
            </div>
            <div className="flex space-x-1.5 group-hover:flex lg:hidden">
              {canUpdateLinkData && <UpdateLinkModal profile={profile} linkToUpdate={link} tags={tags} />}
              {canRemoveLink && <RemoveLinkModal linkIdToRemove={link.id} />}
            </div>
          </div>
          <a href={link.url} rel="noreferrer" target="_blank" className="with-ring space-y-1.5">
            <CardTitle className="leading-tight">{link.description}</CardTitle>
            <CardDescription className="inline-flex items-center space-x-2">
              <span>On {getDomain(link.url)}</span> <ExternalLink size={15} />
            </CardDescription>
          </a>
        </CardHeader>
        <CardContent>
          <TagListWrapper>
            {link.tags.map((tag) => (
              <li key={tag.id}>
                <button onClick={() => goToTagPage(tag)}>
                  <Badge variant="default">{tag.name}</Badge>
                </button>
              </li>
            ))}
          </TagListWrapper>
        </CardContent>
        <CardFooter className="mt-auto space-x-5">
          <LoginModal>
            <DialogTrigger
              className={cn('with-ring flex items-center space-x-[6px]')}
              onClick={(event) => {
                if (profile) {
                  event.preventDefault();
                  profileVote
                    ? mutateLinkVote.mutate({ type: 'remove', voteId: profileVote.id })
                    : mutateLinkVote.mutate({
                        type: 'add',
                        voteToAdd: {
                          userId: profile.id,
                          linkId: link.id,
                        },
                      });
                }
              }}
            >
              <ThumbsUp size={16} className={cn({ ['fill-primary']: Boolean(profileVote) })} />
              <span className="text-[11px] font-bold">{renderFires}</span>
            </DialogTrigger>
          </LoginModal>
          {profile ? (
            <AddCommentModal
              linkToComment={link}
              profile={profile}
              commentsCount={commentsCount}
              onAddSuccess={() => setCommentsCount((prev) => prev + 1)}
              onRemoveSuccess={() => setCommentsCount((prev) => prev - 1)}
            >
              <AddCommentModal.Trigger>{renderComments}</AddCommentModal.Trigger>
            </AddCommentModal>
          ) : (
            <LoginModal>
              <AddCommentModal.Trigger>{renderComments}</AddCommentModal.Trigger>
            </LoginModal>
          )}
        </CardFooter>
      </Card>
    </li>
  );
}

export default LinkCard;
