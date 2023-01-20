import { useLinkToUpdateModal } from '@store/modals.store';
import React from 'react';
import { Modal } from '../modal';
import UpdateLinkForm from './update-link-form';

const UpdateLinkModal: React.FC = React.memo(() => {
  const [linkToUpdateModal, setLinkToUpdateModal] = useLinkToUpdateModal();

  const closeModal = () => {
    setLinkToUpdateModal(null);
  };

  return linkToUpdateModal ? (
    <Modal
      isOpen={!!linkToUpdateModal}
      closeModal={closeModal}
      title={`Update ${linkToUpdateModal.description}`}
      titleClassName="truncate"
    >
      {(initialFocusButtonRef) => (
        <UpdateLinkForm
          closeModal={closeModal}
          linkToUpdate={linkToUpdateModal}
          initialFocusButtonRef={initialFocusButtonRef}
        />
      )}
    </Modal>
  ) : null;
});

export default UpdateLinkModal;
