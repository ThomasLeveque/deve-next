import { ModalsStore, useModalsStore } from '@store/modals.store';
import React from 'react';

import Button from '@components/elements/button';
import SpinnerIcon from '@components/icons/spinner-icon';
import CommentItem from '@components/modals/add-comment-modal/comment-item';

import { COMMENTS_PER_PAGE, useLinkComments } from '@hooks/link/use-link-comments';

import { getDomain } from '@utils/format-string';

import { Modal } from '../modal';
import AddCommentForm from './add-comment-form';

const linkToCommentModalSelector = (state: ModalsStore) => state.linkToCommentModal;
const setLinkToCommentModalSelector = (state: ModalsStore) => state.setLinkToCommentModal;

const AddCommentModal: React.FC = React.memo(() => {
  const linkToCommentModal = useModalsStore(linkToCommentModalSelector);
  const setLinkToCommentModal = useModalsStore(setLinkToCommentModalSelector);

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLinkComments(linkToCommentModal);

  const closeModal = () => {
    setLinkToCommentModal(null);
  };

  return linkToCommentModal ? (
    <Modal isOpen={!!linkToCommentModal} closeModal={closeModal} className="max-w-xl">
      <a
        href={linkToCommentModal.url}
        rel="noreferrer"
        target="_blank"
        className="mb-6 mr-8 with-ring block group"
      >
        <h2 className="text-3xl mb-2 font-poppins-bold group-hover:text-secondary">
          {linkToCommentModal.description}
        </h2>
        <p className="text-xs group-hover:underline">On {getDomain(linkToCommentModal.url)}</p>
      </a>
      <AddCommentForm link={linkToCommentModal} closeModal={closeModal} />
      {linkToCommentModal.commentCount > 0 ? (
        comments ? (
          <>
            <ul>
              {comments?.pages?.map((page) =>
                page?.data.map((comment) => <CommentItem key={comment.id} comment={comment} />)
              )}
            </ul>
            {linkToCommentModal?.commentCount > COMMENTS_PER_PAGE ? (
              <Button
                theme="secondary"
                text={hasNextPage ? 'Load more' : 'No more comments'}
                className="mx-auto mt-8"
                disabled={!hasNextPage}
                loading={isFetchingNextPage}
                onClick={fetchNextPage}
              />
            ) : null}
          </>
        ) : (
          <SpinnerIcon className="w-8 m-auto mt-12" />
        )
      ) : null}
    </Modal>
  ) : null;
});

export default AddCommentModal;
