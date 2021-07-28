import { ModalsStore, useModalsStore } from '@store/modals.store';
import React from 'react';

import Button from '@components/elements/button';

import { useAuth } from '@hooks/auth/useAuth';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';
import { useRemoveLink } from '@hooks/link/use-remove-link';

import { Modal } from '../modal';

const linkToRemoveModalSelector = (state: ModalsStore) => state.linkToRemoveModal;
const setLinkToRemoveModalSelector = (state: ModalsStore) => state.setLinkToRemoveModal;

const RemoveLinkModal: React.FC = React.memo(() => {
  const linkToRemoveModal = useModalsStore(linkToRemoveModalSelector);
  const setLinkToRemoveModal = useModalsStore(setLinkToRemoveModalSelector);

  const { user } = useAuth();
  const linksQueryKeys = useLinksQueryKey(user?.id as string);
  const removeLink = useRemoveLink(linksQueryKeys);

  const closeModal = () => {
    setLinkToRemoveModal(null);
  };

  return linkToRemoveModal ? (
    <Modal
      isOpen={!!linkToRemoveModal}
      closeModal={closeModal}
      title="Are you sure ?"
      className="max-w-md"
    >
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
