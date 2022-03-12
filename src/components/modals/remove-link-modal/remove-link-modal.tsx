import { useRemoveLink } from '@api/link/use-remove-link';
import Button from '@components/elements/button';
import { useLinkToRemoveModal } from '@store/modals.store';
import React from 'react';
import { Modal } from '../modal';

const RemoveLinkModal: React.FC = React.memo(() => {
  const [linkToRemoveModal, setLinkToRemoveModal] = useLinkToRemoveModal();

  const removeLink = useRemoveLink();

  const closeModal = () => {
    setLinkToRemoveModal(null);
  };

  return linkToRemoveModal ? (
    <Modal isOpen={!!linkToRemoveModal} closeModal={closeModal} title="Are you sure ?" className="max-w-md">
      <div className="flex space-x-5">
        <Button text="Cancel" fullWidth theme="gray" onClick={closeModal} />
        <Button
          theme="danger"
          fullWidth
          text="Remove"
          type="button"
          loading={removeLink.isLoading}
          onClick={async () => {
            await removeLink.mutateAsync(linkToRemoveModal.id);
            closeModal();
          }}
        />
      </div>
    </Modal>
  ) : null;
});

export default RemoveLinkModal;
