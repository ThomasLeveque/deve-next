import { SearchIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
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
      <div className={classNames('relative flex flex-wrap', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputProps.id}
            className={classNames(
              'mb-[6px] ml-1 block font-poppins-bold text-[10px] uppercase text-black',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex w-full items-center">
          {isSearchInput && (
            <SearchIcon
              className="absolute left-4 w-6 cursor-text"
              onClick={() => {
                (ref as React.MutableRefObject<HTMLInputElement | null>)?.current?.focus();
              }}
            />
          )}
          {isSearchLength && <XCircleIcon onClick={clearValue} className="absolute right-4 w-6 cursor-pointer" />}
          <input
            ref={ref}
            className={classNames(
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
