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

const TagItem = React.forwardRef<HTMLLIElement, TagProps>(
  ({ text, size = 'small', isClosable = false, onClose, isColored, disabled = false, onClick, ...props }, ref) => {
    const isLarge = size === 'large';

    return (
      <li {...props} ref={ref}>
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
              'py-[10px] px-[12px]': isLarge,
            }
          )}
        >
          <span className={classNames('font-poppins-bold text-[10px] leading-[15px]', { 'text-[15px]': isLarge })}>
            #{text}
          </span>
          {isClosable ? (
            <XIcon
              className={classNames('ml-[6px] w-[14px] cursor-pointer rounded-sm', { 'w-[16px]': isLarge })}
              onClick={(event) => {
                event.stopPropagation();
                onClose && onClose();
              }}
            />
          ) : null}
        </button>
      </li>
    );
  }
);

export default TagItem;
