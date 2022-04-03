import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLLIElement> {
  text: string;
  size?: 'small' | 'large';
  onClick?: () => void;
  isColored?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
  disabled?: boolean;
}

const TagItem: React.FC<TagProps> = ({
  text,
  size = 'small',
  isClosable = false,
  onClose,
  isColored,
  disabled = false,
  onClick,
  ...props
}) => {
  const isLarge = size === 'large';

  return (
    <li {...props}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={classNames(
          'inline-flex rounded-tag py-[7px] px-[10px] uppercase',
          isColored ? 'bg-primary text-black' : 'bg-gray-400/40 text-black',
          {
            'cursor-default': onClick === undefined,
            'with-ring': onClick !== undefined,
          }
        )}
      >
        <span className={classNames('font-poppins-bold text-[10px] leading-[15px]', { 'text-[16px]': isLarge })}>
          #{text}
        </span>
        {isClosable ? (
          <XIcon
            className={classNames('ml-[6px] w-[14px] cursor-pointer rounded-sm', { 'w-[18px]': isLarge })}
            onClick={(event) => {
              event.stopPropagation();
              onClose && onClose();
            }}
          />
        ) : null}
      </button>
    </li>
  );
};

export default TagItem;
