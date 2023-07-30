import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: 'small' | 'large';
  onClick?: () => void;
  isColored?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
  disabled?: boolean;
}

const TagItem = React.forwardRef<HTMLButtonElement, TagProps>(
  ({ text, size = 'small', isClosable = false, onClose, isColored, disabled = false, onClick, ...props }, ref) => {
    const isLarge = size === 'large';

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'rounded-tag inline-flex py-[7px] px-[10px] uppercase',
          isColored ? 'bg-primary text-black' : 'bg-gray-400/40 text-black',

          {
            'cursor-default': onClick === undefined,
            'with-ring': onClick !== undefined,
            'py-[10px] px-[12px]': isLarge,
          }
        )}
        {...props}
      >
        <span className={cn('text-[10px] font-bold leading-[15px]', { 'text-[15px] leading-[20px]': isLarge })}>
          #{text}
        </span>
        {isClosable ? (
          <XMarkIcon
            className={cn('ml-[6px] w-[14px] cursor-pointer rounded-sm', { 'w-[16px]': isLarge })}
            onClick={(event) => {
              event.stopPropagation();
              onClose && onClose();
            }}
          />
        ) : null}
      </button>
    );
  }
);

export default TagItem;
