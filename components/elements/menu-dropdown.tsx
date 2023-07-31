import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React from 'react';

export interface MenuDropdownItemProps {
  text: string;
  onClick: () => void;
  icon?: JSX.Element;
}

interface MenuDropdownProps {
  customButton?: JSX.Element;
  defaultButtonText?: string;
  items: MenuDropdownItemProps[];
  dropdownPosition?: 'left' | 'right';
  className?: string;
  buttonClassName?: string;
}

const MenuDropdown: React.FC<MenuDropdownProps> = React.memo((props) => {
  const dropdownPosition = props.dropdownPosition ?? 'right';

  return (
    <Menu as="div" className={cn('relative w-full', props.className)}>
      {({ open }) => (
        <>
          {props.customButton !== undefined ? (
            <Menu.Button as="div" className={cn(props.buttonClassName)}>
              {props.customButton}
            </Menu.Button>
          ) : (
            <Menu.Button as="div" className={cn('inline-flex', props.buttonClassName)}>
              <Button variant="default">
                {props.defaultButtonText}{' '}
                {open ? <ChevronUpIcon size={18} className="ml-2" /> : <ChevronDownIcon size={18} className="ml-2" />}
              </Button>
            </Menu.Button>
          )}

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              className={cn(
                'rounded-button absolute mt-2 overflow-hidden bg-gray-100 py-1 shadow-lg focus:outline-none',
                dropdownPosition === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
              )}
            >
              {props.items.map((item, i) => (
                <MenuDropdownItem key={`${item.text}${i}`} {...item} />
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
});

const MenuDropdownItem: React.FC<MenuDropdownItemProps> = (props) => {
  const withIcon = props.icon !== undefined;

  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={cn(
            'w-full px-4 py-2 text-left text-sm',
            { 'grid grid-cols-[20px,1fr] gap-3': withIcon },
            {
              'bg-primary': active,
            }
          )}
          onClick={() => {
            props.onClick();
          }}
        >
          {withIcon ? props.icon : null}
          {props.text}
        </button>
      )}
    </Menu.Item>
  );
};

export default MenuDropdown;
