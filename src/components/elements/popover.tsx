import { Popover, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { useMemo } from 'react';

interface MyPopoverProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  buttonItem: JSX.Element;
  className?: string;
}

const MyPopover: React.FC<MyPopoverProps> = (props) => {
  const position = props.position ?? 'top-left';

  const positionClassNames = useMemo(() => {
    switch (position) {
      case 'top-left':
        return '-right-2 bottom-full mb-2';
      case 'top-right':
        return '-left-2 bottom-full mb-2';
      case 'bottom-left':
        return '-right-2 top-full mb-2';
      case 'bottom-right':
        return '-left-2 top-full mb-2';
    }
  }, [position]);

  return (
    <Popover className="relative flex">
      <Popover.Button>{props.buttonItem}</Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
      >
        <Popover.Panel
          className={classNames(
            'absolute z-10 bg-white rounded-button p-4 focus:outline-none shadow-lg',
            props.className,
            positionClassNames
          )}
        >
          {props.children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default MyPopover;
