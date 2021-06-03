import { Dialog } from '@headlessui/react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  description?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed z-20 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="bg-white rounded max-w-sm mx-auto">
          {title !== undefined ? <Dialog.Title>{title}</Dialog.Title> : null}
          {description !== undefined ? (
            <Dialog.Description>{description}</Dialog.Description>
          ) : null}

          {children}
        </div>
      </div>
    </Dialog>
  );
};
