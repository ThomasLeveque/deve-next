import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
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

        <div className="bg-white max-w-md w-full mx-auto rounded-modal z-20 p-10 relative">
          <button
            onClick={closeModal}
            className="absolute right-5 top-5  with-ring rounded-tag hover:bg-gray-100 p-1"
          >
            <XIcon className="w-6" />
          </button>
          {title !== undefined ? (
            <Dialog.Title className="font-poppins-bold text-center text-4xl mb-8 mt-2">
              {title}
            </Dialog.Title>
          ) : null}
          {description !== undefined ? (
            <Dialog.Description>{description}</Dialog.Description>
          ) : null}

          {children}
        </div>
      </div>
    </Dialog>
  );
};
