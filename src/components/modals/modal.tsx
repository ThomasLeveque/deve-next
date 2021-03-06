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
      <Dialog onClose={closeModal} className="fixed inset-0 z-40 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100">
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
                'relative z-20 mx-auto w-full max-w-lg rounded-modal bg-white py-10 px-8 sm:px-10',
                className
              )}
            >
              <button
                onClick={closeModal}
                className="with-ring absolute right-5 top-5 rounded-tag p-1 hover:bg-gray-100"
              >
                <XIcon className="w-6" />
              </button>
              {title !== undefined ? (
                <Dialog.Title
                  className={classNames('mx-4 mb-8 mt-2 text-center font-poppins-bold text-4xl', titleClassName)}
                >
                  {title}
                </Dialog.Title>
              ) : null}
              {description !== undefined ? <Dialog.Description>{description}</Dialog.Description> : null}

              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
