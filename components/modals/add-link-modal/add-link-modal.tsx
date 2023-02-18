import { useAddLinkModalOpen } from '@store/modals.store';
import React from 'react';
import { Modal } from '../modal';
import AddLinkForm from './add-link-form';

const AddLinkModal: React.FC = React.memo(() => {
  const [addLinkModal, setAddLinkModal] = useAddLinkModalOpen();

  const closeModal = () => {
    setAddLinkModal(false);
  };

  return (
    <Modal isOpen={addLinkModal} closeModal={closeModal} title="Add new link">
      {(initialFocusButtonRef) => <AddLinkForm closeModal={closeModal} initialFocusButtonRef={initialFocusButtonRef} />}
    </Modal>
  );
});

export default AddLinkModal;
