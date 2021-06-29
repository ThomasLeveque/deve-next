import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

export interface MenuDropdownItemProps {
  text: string;
  onClick: () => void;
  icon?: JSX.Element;
}

interface MenuDropdownProps {
  button: JSX.Element;
  items: MenuDropdownItemProps[];
  dropdownPosition?: 'left' | 'right';
}

const MenuDropdown: React.FC<MenuDropdownProps> = (props) => {
  const dropdownPosition = props.dropdownPosition ?? 'right';

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex">{props.button}</Menu.Button>
      <Menu.Items
        className={classNames(
          'absolute bg-gray-100 min-w-full mt-2 rounded-button p-1 focus:outline-none shadow-lg',
          dropdownPosition === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
        )}
      >
        {props.items.map((item, i) => (
          <MenuDropdownItem key={`${item.text}${i}`} {...item} />
        ))}
      </Menu.Items>
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
          className={classNames('grid grid-cols-[20px,1fr] gap-3 px-4 py-2 rounded-[6px] text-sm', {
            'bg-primary': active,
          })}
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
