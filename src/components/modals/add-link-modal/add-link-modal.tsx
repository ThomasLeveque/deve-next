import { ModalsStore, useModalsStore } from '@store/modals.store';
import React from 'react';

import { Modal } from '../modal';
import AddLinkForm from './add-link-form';

const addLinkModalSelector = (state: ModalsStore) => state.addLinkModal;
const toggleAddLinkModalSelector = (state: ModalsStore) => state.toggleAddLinkModal;

const AddLinkModal: React.FC = React.memo(() => {
  const addLinkModal = useModalsStore(addLinkModalSelector);
  const toggleAddLinkModal = useModalsStore(toggleAddLinkModalSelector);

  const closeModal = () => {
    toggleAddLinkModal();
  };

  return (
    <Modal isOpen={addLinkModal} closeModal={closeModal} title="Add new link">
      <AddLinkForm closeModal={closeModal} />
    </Modal>
  );
});

export default AddLinkModal;
