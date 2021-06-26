import { EyeIcon, EyeOffIcon, SearchIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useState, useCallback } from 'react';

interface TextInputProps {
  id: string;
  label?: string;
  type?: 'text' | 'password' | 'search';
  placeholder?: string;
  onChange?: (value: string) => void;
  clearValue?: () => void;
  value?: string;
  withShowPassword?: boolean;
  labelClassName?: string;
  inputClassName?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const type = props.type ?? 'text';
  const withShowPassword = props.withShowPassword ?? true;
  const onChange = props.onChange ?? (() => null);
  const clearValue = props.clearValue ?? (() => null);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(
    () => setShowPassword((prevShowPassword) => !prevShowPassword),
    [showPassword]
  );

  return (
    <>
      {props.label !== undefined ? (
        <label
          htmlFor={props.id}
          className={classNames(
            'font-poppins-bold text-[10px] uppercase text-black mb-[6px] ml-1 block',
            props.labelClassName
          )}
        >
          {props.label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        {props.type === 'search' ? <SearchIcon className="w-6 absolute left-4" /> : null}
        {props.type === 'search' && props.value?.length ? (
          <XCircleIcon onClick={clearValue} className="w-6 absolute right-4 cursor-pointer" />
        ) : null}
        <input
          ref={ref}
          type={showPassword ? 'text' : type}
          id={props.id}
          placeholder={props.placeholder}
          className={classNames(
            'bg-gray-100 w-full h-[50px] rounded-button placeholder-gray-400 font-poppins-bold text-sm px-5',
            { 'pr-12': type === 'password' },
            { 'px-12': type === 'search' },
            props.inputClassName
          )}
          value={props.value}
          onChange={(event) => onChange(event.target.value)}
        />
        {props.type === 'password' && withShowPassword ? (
          <span className="w-6 absolute right-4 cursor-pointer">
            {showPassword ? (
              <EyeOffIcon onClick={toggleShowPassword} />
            ) : (
              <EyeIcon onClick={toggleShowPassword} />
            )}
          </span>
        ) : null}
      </div>
    </>
  );
});

export default TextInput;
