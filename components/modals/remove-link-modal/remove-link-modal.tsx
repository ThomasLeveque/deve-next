import { Button } from '@/components/ui/button';
import { useRemoveLink } from '@/data/link/use-remove-link';
import { useLinkToRemoveModal } from '@/store/modals.store';
import { formatError } from '@/utils/format-string';
import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../modal';

const RemoveLinkModal: React.FC = React.memo(() => {
  const [linkToRemoveModal, setLinkToRemoveModal] = useLinkToRemoveModal();

  const removeLink = useRemoveLink();

  const closeModal = useCallback(() => {
    setLinkToRemoveModal(null);
  }, [setLinkToRemoveModal]);

  const handleRemoveLink = useCallback(async () => {
    try {
      if (!linkToRemoveModal) {
        throw new Error('Link to remove unknown, try again');
      }

      await removeLink.mutateAsync(linkToRemoveModal.id);
      closeModal();
    } catch (err) {
      toast.error(formatError(err as Error));
    }
  }, [linkToRemoveModal, closeModal, removeLink]);

  return linkToRemoveModal ? (
    <Modal isOpen={!!linkToRemoveModal} closeModal={closeModal} title="Are you sure ?" className="max-w-md">
      {(initialFocusButtonRef) => (
        <div className="flex space-x-5">
          <Button className="w-full" variant="link" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            ref={initialFocusButtonRef}
            variant="destructive"
            className="w-full"
            type="button"
            // loading={removeLink.isLoading}
            onClick={handleRemoveLink}
          >
            Remove
          </Button>
        </div>
      )}
    </Modal>
  ) : null;
});

export default RemoveLinkModal;
