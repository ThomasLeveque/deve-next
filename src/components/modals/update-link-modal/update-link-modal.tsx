import { ModalsStore, useModalsStore } from '@store/modals.store';
import React from 'react';

import { Modal } from '../modal';
import UpdateLinkForm from './update-link-form';

const linkToUpdateModalSelector = (state: ModalsStore) => state.linkToUpdateModal;
const setLinkToUpdateModalSelector = (state: ModalsStore) => state.setLinkToUpdateModal;

const UpdateLinkModal: React.FC = React.memo(() => {
  const linkToUpdateModal = useModalsStore(linkToUpdateModalSelector);
  const setLinkToUpdateModal = useModalsStore(setLinkToUpdateModalSelector);

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
      <UpdateLinkForm closeModal={closeModal} linkToUpdate={linkToUpdateModal} />
    </Modal>
  ) : null;
});

export default UpdateLinkModal;
