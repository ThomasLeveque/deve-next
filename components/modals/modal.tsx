import { cn } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  children:
    | (React.ReactNode | React.ReactNode[])
    | ((
        initialFocusButtonRef: React.MutableRefObject<HTMLButtonElement | null>
      ) => React.ReactNode | React.ReactNode[]);
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
  const initialFocusButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Transition show={isOpen} appear as={Fragment}>
      <Dialog onClose={closeModal} className="fixed inset-0 z-40 overflow-y-auto" initialFocus={initialFocusButtonRef}>
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
              className={cn(
                'rounded-modal relative z-20 mx-auto w-full max-w-lg bg-white py-10 px-8 sm:px-10',
                className
              )}
            >
              <button
                onClick={closeModal}
                className="with-ring rounded-tag absolute right-5 top-5 p-1 hover:bg-gray-100"
              >
                <XMarkIcon className="w-6" />
              </button>
              {title !== undefined ? (
                <Dialog.Title className={cn('mx-4 mb-8 mt-2 text-center text-4xl font-bold', titleClassName)}>
                  {title}
                </Dialog.Title>
              ) : null}
              {description !== undefined ? <Dialog.Description>{description}</Dialog.Description> : null}

              {typeof children === 'function' ? children(initialFocusButtonRef) : children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
