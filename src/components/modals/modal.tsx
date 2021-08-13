import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  title,
  description,
  className,
  titleClassName,
  children,
}) => {
  return (
    <Transition show={isOpen} appear as={Fragment}>
      <Dialog onClose={closeModal} className="fixed z-40 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
          >
            <div
              className={classNames(
                'bg-white max-w-lg w-full mx-auto rounded-modal z-20 py-10 sm:px-10 px-8 relative',
                className
              )}
            >
              <button
                onClick={closeModal}
                className="absolute right-5 top-5 with-ring rounded-tag hover:bg-gray-100 p-1"
              >
                <XIcon className="w-6" />
              </button>
              {title !== undefined ? (
                <Dialog.Title
                  className={classNames(
                    'font-poppins-bold text-center text-4xl mb-8 mt-2 mx-4',
                    titleClassName
                  )}
                >
                  {title}
                </Dialog.Title>
              ) : null}
              {description !== undefined ? (
                <Dialog.Description>{description}</Dialog.Description>
              ) : null}

              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
