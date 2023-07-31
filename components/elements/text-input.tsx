import { cn } from '@/lib/utils';
import { Search, XCircleIcon } from 'lucide-react';
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
            <Search
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
              'with-ring rounded-button h-[50px] w-full bg-gray-100 px-5 text-sm placeholder-gray-400',
              { 'px-12': inputProps.type === 'search' },
              className
            )}
            {...inputProps}
          />
        </div>
        {errorText && <p className="text-danger-400 absolute top-full right-1 mt-1 text-[10px]">{errorText}</p>}
      </div>
    );
  }
);

export default TextInput;
