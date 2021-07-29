import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import React, { useMemo } from 'react';

interface MyPopoverProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  buttonItem: JSX.Element;
  className?: string;
}

const MyPopover: React.FC<MyPopoverProps> = (props, ref) => {
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

      <Popover.Panel
        className={classNames(
          'absolute z-10 bg-white rounded-button p-4 focus:outline-none shadow-lg',
          props.className,
          positionClassNames
        )}
      >
        {props.children}
      </Popover.Panel>
    </Popover>
  );
};

export default MyPopover;
