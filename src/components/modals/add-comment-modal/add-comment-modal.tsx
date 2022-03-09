import { COMMENTS_PER_PAGE, useComments } from '@api/comment/use-comments';
import Button from '@components/elements/button';
import SpinnerIcon from '@components/icons/spinner-icon';
import CommentItem from '@components/modals/add-comment-modal/comment-item';
import { useLinkToCommentModal } from '@store/modals.store';
import { getDomain } from '@utils/format-string';
import React from 'react';
import { Modal } from '../modal';
import AddCommentForm from './add-comment-form';

const AddCommentModal: React.FC = React.memo(() => {
  const [linkToCommentModal, setLinkToCommentModal] = useLinkToCommentModal();

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useComments(linkToCommentModal?.id);

  const closeModal = () => {
    setLinkToCommentModal(null);
  };

  return linkToCommentModal ? (
    <Modal isOpen={!!linkToCommentModal} closeModal={closeModal} className="max-w-2xl">
      <a href={linkToCommentModal.url} rel="noreferrer" target="_blank" className="with-ring group mb-6 mr-8 block">
        <h2 className="mb-2 break-words font-poppins-bold text-3xl group-hover:text-secondary">
          {linkToCommentModal.description}
        </h2>
        <p className="text-xs group-hover:underline">On {getDomain(linkToCommentModal.url)}</p>
      </a>
      <AddCommentForm linkId={linkToCommentModal.id} />
      {isLoading && <SpinnerIcon className="m-auto mt-12 w-8" />}
      {comments && (comments?.pages[0]?.data?.length ?? 0) > 0 && (
        <>
          <ul className="mt-8 space-y-5">
            {comments.pages?.map((page) =>
              page?.data.map((comment) => (
                <CommentItem key={comment.id} comment={comment} linkId={linkToCommentModal.id} />
              ))
            )}
          </ul>
          {linkToCommentModal.commentsCount > COMMENTS_PER_PAGE ? (
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
      )}
    </Modal>
  ) : null;
});

export default AddCommentModal;
