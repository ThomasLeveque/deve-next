'use client';

import SpinnerIcon from '@/components/icons/SpinnerIcon';
import CommentItem from '@/components/modals/AddCommentModal/CommentItem';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { COMMENTS_PER_PAGE, useComments } from '@/data/comment/use-comments';
import { FetchLinksReturn } from '@/lib/queries/fetch-links';
import { FetchProfileReturn } from '@/lib/queries/fetch-profile';
import { getDomain } from '@/utils/format-string';
import { MessageCircle } from 'lucide-react';
import React, { PropsWithChildren, useState } from 'react';
import AddCommentForm from './AddCommentForm';

type AddCommentModalProps = {
  linkToComment: FetchLinksReturn['links'][0];
  children: React.ReactNode;
  profile: NonNullable<FetchProfileReturn>;
  commentsCount: number;
  onAddSuccess?: () => void;
  onRemoveSuccess?: () => void;
};

function AddCommentModal({
  linkToComment,
  children,
  profile,
  commentsCount,
  onAddSuccess,
  onRemoveSuccess,
}: AddCommentModalProps) {
  const [open, setOpen] = useState(false);

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(linkToComment?.id, Boolean(linkToComment?.id) && open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl overflow-auto">
        <DialogHeader>
          <a className="mb-2 space-y-2" href={linkToComment.url} rel="noreferrer" target="_blank">
            <DialogTitle className="break-words">{linkToComment.description}</DialogTitle>
            <DialogDescription>On {getDomain(linkToComment.url)}</DialogDescription>
          </a>
        </DialogHeader>
        <AddCommentForm linkId={linkToComment.id} profile={profile} onSuccess={() => onAddSuccess?.()} />

        {commentsCount > 0 ? (
          <>
            {comments ? (
              <>
                <ul className="mt-8 space-y-5">
                  {comments.pages?.map((page) =>
                    page?.data?.map((comment) => (
                      <CommentItem
                        profile={profile}
                        key={comment.id}
                        comment={comment}
                        onRemove={() => onRemoveSuccess?.()}
                      />
                    ))
                  )}
                </ul>
                {commentsCount > COMMENTS_PER_PAGE ? (
                  <Button
                    className="mx-auto mt-8"
                    disabled={!hasNextPage}
                    isLoading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    {hasNextPage ? 'Load more' : 'No more comments'}
                  </Button>
                ) : null}
              </>
            ) : (
              <SpinnerIcon size={32} className="m-auto mt-12" />
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AddCommentModalTrigger({ children }: PropsWithChildren) {
  return (
    <DialogTrigger className="with-ring inline-flex items-center space-x-1.5">
      <MessageCircle size={17} />
      <span className="text-[11px] font-bold">{children}</span>
    </DialogTrigger>
  );
}

AddCommentModal.Trigger = AddCommentModalTrigger;

export default AddCommentModal;
