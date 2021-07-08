import { Menu } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';

import Button from './button';

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
}

const MenuDropdown: React.FC<MenuDropdownProps> = (props) => {
  const dropdownPosition = props.dropdownPosition ?? 'right';

  return (
    <Menu as="div" className={classNames('relative w-full', props.className)}>
      {({ open }) => (
        <>
          {props.customButton !== undefined ? (
            <Menu.Button as="div">{props.customButton}</Menu.Button>
          ) : (
            <Menu.Button as="div" className="inline-flex">
              <Button
                theme="gray"
                text={props.defaultButtonText}
                icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              />
            </Menu.Button>
          )}

          <Menu.Items
            className={classNames(
              'absolute bg-gray-100 mt-2 rounded-button py-1 focus:outline-none shadow-lg',
              dropdownPosition === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            )}
          >
            {props.items.map((item, i) => (
              <MenuDropdownItem key={`${item.text}${i}`} {...item} />
            ))}
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

const MenuDropdownItem: React.FC<MenuDropdownItemProps> = (props) => {
  const withIcon = props.icon !== undefined;

  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href="#"
          className={classNames(
            'px-4 py-2 text-sm',
            { 'grid grid-cols-[20px,1fr] gap-3': withIcon },
            {
              'bg-primary': active,
            }
          )}
          onClick={(event) => {
            event.preventDefault();
            props.onClick();
          }}
        >
          {withIcon ? props.icon : null}
          {props.text}
        </a>
      )}
    </Menu.Item>
  );
};

export default MenuDropdown;
