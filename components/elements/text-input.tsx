import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@utils/cn';
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  clearValue?: () => void;
  labelClassName?: string;
  wrapperClassName?: string;
  errorText?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ clearValue, labelClassName, wrapperClassName, errorText, label, className, ...inputProps }, ref) => {
    const isSearchInput = inputProps.type === 'search';
    const isSearchLength =
      isSearchInput && inputProps.value && typeof inputProps.value === 'string' && inputProps.value.length > 0;

    return (
      <div className={cn('relative flex flex-wrap', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputProps.id}
            className={cn('mb-[6px] ml-1 block text-[10px] font-bold uppercase text-black', labelClassName)}
          >
            {label}
          </label>
        )}
        <div className="relative flex w-full items-center">
          {isSearchInput && (
            <MagnifyingGlassIcon
              className="absolute left-4 w-6 cursor-text text-gray-600"
              onClick={() => {
                (ref as React.MutableRefObject<HTMLInputElement | null>)?.current?.focus();
              }}
            />
          )}
          {isSearchLength && <XCircleIcon onClick={clearValue} className="absolute right-4 w-6 cursor-pointer" />}
          <input
            ref={ref}
            className={cn(
              'with-ring h-[50px] w-full rounded-button bg-gray-100 px-5 text-sm placeholder-gray-400',
              { 'px-12': inputProps.type === 'search' },
              className
            )}
            {...inputProps}
          />
        </div>
        {errorText && <p className="absolute top-full right-1 mt-1 text-[10px] text-danger-400">{errorText}</p>}
      </div>
    );
  }
);

export default TextInput;
