import { ModalsStore, useModalsStore } from '@store/modals.store';
import React from 'react';

import LinkCommentItem from '@components/link/link-comment-item';

import { useLinkComments } from '@libs/link/queries';

import { Modal } from '../modal';
import AddCommentForm from './add-comment-form';

const linkToCommentModalSelector = (state: ModalsStore) => state.linkToCommentModal;
const setLinkToCommentModalSelector = (state: ModalsStore) => state.setLinkToCommentModal;

const AddCommentModal: React.FC = () => {
  const linkToCommentModal = useModalsStore(linkToCommentModalSelector);
  const setLinkToCommentModal = useModalsStore(setLinkToCommentModalSelector);

  const { data: comments } = useLinkComments(linkToCommentModal?.id);

  const closeModal = () => {
    setLinkToCommentModal(null);
  };

  return linkToCommentModal ? (
    <Modal isOpen={!!linkToCommentModal} closeModal={closeModal} title="Add a comment">
      <h2 className="text-2xl font-poppins-bold mb-6">{linkToCommentModal.description}</h2>
      <AddCommentForm link={linkToCommentModal} closeModal={closeModal} />
      {comments ? (
        <ul>
          {comments?.pages.map((page) =>
            page.data.map((comment) => <LinkCommentItem key={comment.id} comment={comment} />)
          )}
        </ul>
      ) : null}
    </Modal>
  ) : null;
};

export default AddCommentModal;
