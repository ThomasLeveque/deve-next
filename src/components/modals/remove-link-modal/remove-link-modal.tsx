import { useAuth } from '@api/auth/useAuth';
import { useLinksQueryKey } from '@api/old-link/use-links-query-key';
import { useRemoveLink } from '@api/old-link/use-remove-link';
import Button from '@components/elements/button';
import { useLinkToRemoveModal } from '@store/modals.store';
import React from 'react';
import { Modal } from '../modal';

const RemoveLinkModal: React.FC = React.memo(() => {
  const [linkToRemoveModal, setLinkToRemoveModal] = useLinkToRemoveModal();

  const { user } = useAuth();
  const linksQueryKeys = useLinksQueryKey(user?.id as string);
  const removeLink = useRemoveLink(linksQueryKeys);

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
          onClick={() => {
            removeLink.mutate(linkToRemoveModal);
            closeModal();
          }}
        />
      </div>
    </Modal>
  ) : null;
});

export default RemoveLinkModal;
